/**
 * OpenAPI documentation for mentor routes.
 * Mounted at /api/v1/ via routes/v1/mentor/index.js
 *
 * Protected routes require JWT (Bearer header or `token` cookie) and role mentor/teacher.
 */

/**
 * @swagger
 * tags:
 *   - name: Mentor - Catalog
 *     description: Public catalog, search, and reference data
 *   - name: Mentor - Profile
 *     description: Mentor profile CRUD and page bundles
 *   - name: Mentor - Skills
 *     description: Mentor teaching skills (skill / sub-skill)
 *   - name: Mentor - Portfolio
 *     description: Portfolio links and file uploads
 *   - name: Mentor - Experience
 *     description: Education and work experience entries
 *   - name: Mentor - Posts
 *     description: Mentor session / class posts
 *   - name: Mentor - Files
 *     description: Static file serving for portfolio and profile pictures
 */

/**
 * @swagger
 * /api/v1/mentors/catalog:
 *   get:
 *     summary: Get skills and provinces catalog
 *     description: Combined skills (with sub-skills) and provinces for filters and onboarding.
 *     tags: [Mentor - Catalog]
 *     responses:
 *       200:
 *         description: Catalog payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CatalogResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorApiError'
 */

/**
 * @swagger
 * /api/v1/mentors:
 *   get:
 *     summary: List mentors (paginated)
 *     description: Returns paginated mentor list with optional filters.
 *     tags: [Mentor - Catalog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 50 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search firstname, lastname, or description
 *       - in: query
 *         name: skillId
 *         schema: { type: integer }
 *       - in: query
 *         name: subSkillId
 *         schema: { type: integer }
 *       - in: query
 *         name: minExperience
 *         schema: { type: integer }
 *         description: Minimum experience_years
 *     responses:
 *       200:
 *         description: Paginated mentor list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorApiError'
 *   post:
 *     summary: Create mentor profile
 *     description: Creates mentor row for the authenticated user. One profile per user.
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorCreateUpdate'
 *     responses:
 *       201:
 *         description: Mentor profile created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Mentor'
 *       400:
 *         description: Profile already exists or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/mentors/search:
 *   get:
 *     summary: Search mentors
 *     description: Same handler as GET /mentors — supports q, skillId, subSkillId, minExperience, page, limit.
 *     tags: [Mentor - Catalog]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: skillId
 *         schema: { type: integer }
 *       - in: query
 *         name: subSkillId
 *         schema: { type: integer }
 *       - in: query
 *         name: minExperience
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorListResponse'
 */

/**
 * @swagger
 * /api/v1/mentors/skill/listAllSkill:
 *   get:
 *     summary: List all skills with sub-skills
 *     tags: [Mentor - Catalog]
 *     responses:
 *       200:
 *         description: Skill catalog
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Skill'
 */

/**
 * @swagger
 * /api/v1/mentors/provinces/listAll:
 *   get:
 *     summary: List all provinces
 *     tags: [Mentor - Catalog]
 *     responses:
 *       200:
 *         description: Province list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Province'
 */

/**
 * @swagger
 * /api/v1/mentors/me:
 *   get:
 *     summary: Get authenticated mentor profile
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current mentor row
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Mentor'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mentor profile not found
 */

/**
 * @swagger
 * /api/v1/mentors/me/analytics:
 *   get:
 *     summary: Get mentor analytics
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Analytics payload (views, posts, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorApiSuccess'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mentor profile not found
 */

/**
 * @swagger
 * /api/v1/mentors/me/dashboard:
 *   get:
 *     summary: Get mentor dashboard bundle
 *     description: Returns mentor row, analytics, and posts in one response.
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard bundle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MentorApiSuccess'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Mentor profile not found
 */

/**
 * @swagger
 * /api/v1/mentors/me/edit-profile:
 *   get:
 *     summary: Get edit-profile page bundle
 *     description: Profile, portfolio, experience, mentor skills, and catalog in one response.
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Edit profile bundle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditProfileBundle'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/mentors/me/posts:
 *   get:
 *     summary: List my posts (all statuses)
 *     tags: [Mentor - Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published] }
 *     responses:
 *       200:
 *         description: Post list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MentorPost'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}:
 *   get:
 *     summary: Get mentor by user ID
 *     tags: [Mentor - Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mentor profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Mentor'
 *       400:
 *         description: Invalid user id
 *       404:
 *         description: Mentor not found
 *   put:
 *     summary: Update mentor profile
 *     description: Owner only. Writable fields — firstname, lastname, gender, phone_number, province_id, experience_years, description, profile_picture.
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorCreateUpdate'
 *     responses:
 *       200:
 *         description: Updated mentor
 *       400:
 *         description: No fields to update
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Mentor not found
 *   delete:
 *     summary: Delete mentor profile
 *     description: Owner only. Deletes mentor and related data.
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         delete: { type: boolean, example: true }
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mentor not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Mentor - Profile]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         profile_picture: { type: string }
 *       400:
 *         description: Missing file
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/profile-views:
 *   post:
 *     summary: Record a profile view
 *     description: Increments profile_view_count. Self-views are not counted.
 *     tags: [Mentor - Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: View recorded or skipped (self_view)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         recorded: { type: boolean }
 *                         reason: { type: string, example: self_view }
 *                         profile_view_count: { type: integer }
 *       404:
 *         description: Mentor not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/skills:
 *   get:
 *     summary: List mentor skills
 *     tags: [Mentor - Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mentor skill rows with Skill and SubSkill
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MentorSkillItem'
 *   post:
 *     summary: Add mentor skill
 *     description: Owner only. Idempotent if sub_skill already linked.
 *     tags: [Mentor - Skills]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorSkillAddRequest'
 *     responses:
 *       201:
 *         description: Skill added
 *       200:
 *         description: Skill already exists
 *       400:
 *         description: Invalid sub_skill_id
 *       404:
 *         description: Sub-skill not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/skills/{subSkillId}:
 *   delete:
 *     summary: Remove mentor skill
 *     tags: [Mentor - Skills]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: subSkillId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Skill removed
 *       404:
 *         description: Skill not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/portfolio:
 *   get:
 *     summary: List portfolio items
 *     tags: [Mentor - Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Portfolio items with files
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PortfolioItem'
 *   post:
 *     summary: Create portfolio link item
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioCreateRequest'
 *     responses:
 *       201:
 *         description: Portfolio item created
 *       400:
 *         description: Invalid link
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/portfolio/with-file:
 *   post:
 *     summary: Create portfolio item with file upload
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, link]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *                 format: uri
 *               link_tag: { type: string }
 *               title: { type: string, description: Alias for link_tag }
 *               description: { type: string }
 *               portfolio_date: { type: string, format: date }
 *               item_type:
 *                 type: string
 *                 enum: [link, project, certificate, achievement]
 *     responses:
 *       201:
 *         description: Portfolio item created with file
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/portfolio/{link}:
 *   patch:
 *     summary: Update portfolio item
 *     description: Path param `link` is the URL-encoded portfolio link.
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: link
 *         required: true
 *         schema: { type: string }
 *         description: URL-encoded portfolio link
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated portfolio item
 *       404:
 *         description: Portfolio item not found
 *   delete:
 *     summary: Delete portfolio item
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: link
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Portfolio item not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/portfolio/{link}/files:
 *   get:
 *     summary: List files for a portfolio item
 *     tags: [Mentor - Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: link
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File list
 *   post:
 *     summary: Upload file to portfolio item
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: link
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/portfolio/{link}/files/{fileId}:
 *   delete:
 *     summary: Delete portfolio file
 *     tags: [Mentor - Portfolio]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: link
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File deleted
 *       404:
 *         description: File not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/experience:
 *   get:
 *     summary: List mentor experience entries
 *     tags: [Mentor - Experience]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Experience list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MentorExperience'
 *       404:
 *         description: Mentor not found
 *   post:
 *     summary: Create experience entry
 *     tags: [Mentor - Experience]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorExperienceCreate'
 *     responses:
 *       201:
 *         description: Experience created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/experience/{experienceId}:
 *   patch:
 *     summary: Update experience entry
 *     tags: [Mentor - Experience]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorExperienceCreate'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Experience not found
 *   delete:
 *     summary: Delete experience entry
 *     tags: [Mentor - Experience]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Experience not found
 */

/**
 * @swagger
 * /api/v1/mentors/posts:
 *   get:
 *     summary: List published posts (public feed)
 *     tags: [Mentor - Posts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published] }
 *         description: Defaults to published
 *       - in: query
 *         name: province_id
 *         schema: { type: integer }
 *       - in: query
 *         name: sub_skill_id
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50, maximum: 200 }
 *     responses:
 *       200:
 *         description: Post list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MentorPost'
 */

/**
 * @swagger
 * /api/v1/mentors/posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     description: Published posts are public; drafts require owning mentor.
 *     tags: [Mentor - Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post detail
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/MentorApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/MentorPost'
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/v1/mentors/posts/{postId}/legacy:
 *   get:
 *     summary: Get post by ID (legacy alias)
 *     tags: [Mentor - Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post detail
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/v1/mentors/{userId}/posts:
 *   get:
 *     summary: List posts by mentor
 *     description: Defaults to published; draft status requires owning mentor.
 *     tags: [Mentor - Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published] }
 *     responses:
 *       200:
 *         description: Post list
 *   post:
 *     summary: Create post
 *     tags: [Mentor - Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorPostCreate'
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /api/v1/mentors/posts/{postId}:
 *   patch:
 *     summary: Update post
 *     tags: [Mentor - Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MentorPostUpdate'
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete post
 *     tags: [Mentor - Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/v1/portfolio-files/{mentorId}/{filename}:
 *   get:
 *     summary: Download portfolio file
 *     tags: [Mentor - Files]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File binary
 *       404:
 *         description: File not found
 */

/**
 * @swagger
 * /api/v1/profile-pictures/{userId}/{filename}:
 *   get:
 *     summary: Download profile picture
 *     tags: [Mentor - Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Image binary
 *       404:
 *         description: File not found
 */

export {};
