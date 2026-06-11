import stripe from '../../config/stripe.js';
import Subscription from '../../models/subscriptionModel.js';
import SubscriptionPlan from '../../models/subscriptionPlanModel.js';
import StripePayment from '../../models/stripePaymentModel.js';
import TransactionDetail from '../../models/transactionDetailModel.js';
import User from '../../models/userModel.js';
import { toStripeAmount, fromStripeAmount } from '../../utils/stripe/stripeAmounts.js';
import { activateSubscription } from '../../utils/stripe/subscriptionHelper.js';

function toIsoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function formatSubscriptionForClient(subscription, plan) {
  if (!subscription || !plan || Number(plan.price) <= 0) {
    return {
      plan: 'free',
      status: null,
      billingInterval: 'monthly',
      subscribedAt: null,
      billingAnchorDay: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      nextBilling: null,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      cardLast4: null,
      paymentFailures: 0,
      lastPaymentFailedAt: null,
      gracePeriodEndsAt: null,
      scheduledChange: null,
      trialEndsAt: null,
      invoices: [],
    };
  }

  const startDate = subscription.start_date ? new Date(subscription.start_date) : new Date();
  const endDate = subscription.end_date ? new Date(subscription.end_date) : null;
  const isActive = !endDate || endDate > new Date();

  return {
    plan: isActive ? 'premium' : 'free',
    status: isActive ? 'active' : 'canceled',
    billingInterval: 'monthly',
    subscribedAt: startDate.toISOString(),
    billingAnchorDay: startDate.getDate(),
    currentPeriodStart: toIsoDate(startDate),
    currentPeriodEnd: toIsoDate(endDate),
    nextBilling: toIsoDate(endDate),
    cancelAtPeriodEnd: false,
    canceledAt: isActive ? null : toIsoDate(endDate),
    cardLast4: null,
    paymentFailures: 0,
    lastPaymentFailedAt: null,
    gracePeriodEndsAt: null,
    scheduledChange: null,
    trialEndsAt: null,
    invoices: [],
  };
}

function requireStripe(res) {
  if (!stripe) {
    res.status(503).json({ message: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env' });
    return false;
  }
  return true;
}

function isValidRedirectUrl(url) {
  if (!url) return true;

  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
export const getStripeConfig = (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return res.status(503).json({ message: 'STRIPE_PUBLISHABLE_KEY is not configured' });
  }
  return res.json({
    publishableKey,
    currency: (process.env.STRIPE_CURRENCY || 'usd').toLowerCase(),
  });
};

export const createCheckoutSession = async (req, res) => {
  try {
    if (!requireStripe(res)) return;

    const {
      subscription_plan_id: subscriptionPlanId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    } = req.body;
    const userId = req.user.user_id;

    const parsedPlanId = Number(subscriptionPlanId);
    if (!Number.isInteger(parsedPlanId) || parsedPlanId <= 0) {
      return res.status(400).json({ message: 'subscription_plan_id must be a positive integer' });
    }

    if (!isValidRedirectUrl(successUrl) || !isValidRedirectUrl(cancelUrl)) {
      return res.status(400).json({ message: 'success_url and cancel_url must be valid http(s) URLs' });
    }

    const plan = await SubscriptionPlan.findByPk(parsedPlanId);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();
    const amount = Number(plan.price);
    const unitAmount = toStripeAmount(amount, currency);
    if (!unitAmount) {
      return res.status(400).json({ message: 'Subscription plan price must be greater than 0' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: plan.name,
              description: plan.description || undefined,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${frontendUrl}/payment/cancel`,
      customer_email: req.user.email,
      metadata: {
        user_id: String(userId),
        subscription_plan_id: String(parsedPlanId),
        user_type_id: String(user.user_type_id),
      },
    });

    await StripePayment.create({
      user_id: userId,
      stripe_checkout_session_id: session.id,
      amount,
      currency,
      status: 'pending',
    });

    return res.status(201).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listSubscriptionPlans = async (req, res) => {
  try {
    let plans = await SubscriptionPlan.findAll({
      attributes: [
        'subscription_Plan_id',
        'name',
        'price',
        'duration_day',
        'description',
      ],
      order: [['price', 'ASC']],
    });

    if (!plans.some((plan) => Number(plan.price) > 0)) {
      const [premiumPlan] = await SubscriptionPlan.findOrCreate({
        where: { name: 'Premium Monthly' },
        defaults: {
          admin_id: 1,
          name: 'Premium Monthly',
          price: 29,
          description: 'Mentor premium — monthly',
        },
      });
      plans = [...plans, premiumPlan];
    }

    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const subscription = await Subscription.findOne({
      where: { user_id: userId },
      include: [{ model: SubscriptionPlan }],
      order: [['subscription_id', 'DESC']],
    });

    const transactions = subscription
      ? await TransactionDetail.findAll({
          where: {
            user_id: userId,
            subscription_id: subscription.subscription_id,
          },
          order: [['payment_id', 'DESC']],
          limit: 20,
        })
      : [];

    const payload = formatSubscriptionForClient(
      subscription,
      subscription?.SubscriptionPlan,
    );

    payload.invoices = transactions.map((tx) => ({
      id: `INV-${tx.payment_id}`,
      date: toIsoDate(new Date()),
      description: tx.remark || 'Premium subscription payment',
      amount: 0,
      status: 'paid',
      periodStart: toIsoDate(subscription?.start_date),
      periodEnd: toIsoDate(subscription?.end_date),
      billingInterval: 'monthly',
    }));

    return res.json({ success: true, data: payload });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCheckoutSession = async (req, res) => {
  try {
    if (!requireStripe(res)) return;

    const { sessionId } = req.params;
    const userId = req.user.user_id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const payment = await StripePayment.findOne({
      where: { stripe_checkout_session_id: sessionId },
    });

    if (!payment || payment.user_id !== userId) {
      return res.status(404).json({ message: 'Checkout session not found' });
    }

    if (session.payment_status === 'paid' && payment.status !== 'completed') {
      const subscriptionPlanId = Number(session.metadata?.subscription_plan_id);
      const userTypeId = session.metadata?.user_type_id
        ? Number(session.metadata.user_type_id)
        : null;

      if (subscriptionPlanId) {
        const subscription = await activateSubscription({
          userId,
          subscriptionPlanId,
          userTypeId,
        });

        payment.subscription_id = subscription.subscription_id;
        payment.stripe_payment_intent_id =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;
        payment.amount = fromStripeAmount(session.amount_total, session.currency);
        payment.currency = session.currency || payment.currency;
        payment.status = 'completed';
        payment.update_date = new Date();
        await payment.save();

        const existingTx = await TransactionDetail.findOne({
          where: {
            user_id: userId,
            subscription_id: subscription.subscription_id,
            bank_tx_id: payment.stripe_payment_intent_id,
          },
        });

        if (!existingTx) {
          await TransactionDetail.create({
            user_id: userId,
            subscription_id: subscription.subscription_id,
            bank_tx_id: payment.stripe_payment_intent_id,
            remark: `Stripe checkout ${session.id}`,
            paid_account: session.customer_details?.email || null,
          });
        }
      }
    }

    return res.json({
      sessionId: session.id,
      status: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      subscriptionStatus: payment.status,
      subscriptionId: payment.subscription_id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
