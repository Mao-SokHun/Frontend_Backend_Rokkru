import { useEffect, useMemo, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { useTranslation } from '@/i18n'
import { localizeMentor } from '@/utils/mentorMapper'
import {
  fetchMentorWithSkills,
  fetchMentorPortfolio,
  fetchMentorPosts,
  fetchMentorExperience,
} from '@/services/mentors/mentorService'
import {
  mapPortfolioToCredentials,
  mapPostsToAvailabilitySlots,
} from '@/utils/mentorDetailUtils'

/**
 * Public mentor profile: skills, portfolio, published posts, experience.
 */
export function useMentorDetail(userId) {
  const { lang } = useTranslation()
  const [mentor, setMentor] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [credentials, setCredentials] = useState([])
  const [posts, setPosts] = useState([])
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState(null)

  const localizedMentor = useMemo(() => localizeMentor(mentor, lang), [mentor, lang])
  const availabilitySlots = useMemo(
    () => mapPostsToAvailabilitySlots(posts, lang),
    [posts, lang]
  )

  useEffect(() => {
    if (!userId) {
      setMentor(null)
      setPortfolio([])
      setCredentials([])
      setPosts([])
      setExperience([])
      setLoading(false)
      return
    }

    if (!isApiEnabled()) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchMentorWithSkills(userId),
      fetchMentorPortfolio(userId),
      fetchMentorPosts(userId, { status: 'published' }),
      fetchMentorExperience(userId),
    ])
      .then(([mentorRow, portfolioRows, postRows, experienceRows]) => {
        if (cancelled) return
        setMentor(mentorRow)
        const portfolioList = portfolioRows ?? []
        setPortfolio(portfolioList)
        setCredentials(mapPortfolioToCredentials(portfolioList))
        setPosts(postRows ?? [])
        setExperience(experienceRows ?? [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setMentor(null)
          setPortfolio([])
          setCredentials([])
          setPosts([])
          setExperience([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  return {
    mentor: localizedMentor,
    portfolio,
    credentials,
    availabilitySlots,
    experience,
    loading,
    error,
  }
}

export default useMentorDetail
