import { Router } from 'express';
import * as portfolioController from '../../../controllers/mentor_system/mentorPortfolioController.js';
import * as mentorController from '../../../controllers/mentor_system/mentorController.js';
import * as skillsController from '../../../controllers/mentor_system/mentorSkillsController.js';
import * as provinceController from '../../../controllers/mentor_system/provinceController.js';
import * as postsController from '../../../controllers/mentor_system/mentorPostsController.js';
import * as profileViewController from '../../../controllers/mentor_system/mentorProfileViewController.js';
import * as bundleController from '../../../controllers/mentor_system/mentorBundleController.js';

const router = Router();

router.get('/portfolio-files/:mentorId/:filename', portfolioController.servePortfolioFile);
router.get('/profile-pictures/:userId/:filename', mentorController.serveProfilePicture);

router.get('/mentors/catalog', bundleController.getCatalog);
router.get('/mentors', mentorController.listMentors);
router.get('/mentors/search', mentorController.searchMentors);

router.get('/mentors/skill/listAllSkill', skillsController.listSkill);
router.get('/mentors/provinces/listAll', provinceController.listAllProvinces);

router.get('/mentors/posts', postsController.listPublishedPosts);
router.get('/mentors/posts/:postId', postsController.getPostById);
router.get('/mentors/posts/:postId/legacy', postsController.getPostByIdLegacy);

router.post('/mentors/:userId/profile-views', profileViewController.recordProfileView);

export default router;
