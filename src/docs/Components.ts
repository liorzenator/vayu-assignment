/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         limit:
 *           type: integer
 *         offset:
 *           type: integer
 *         page:
 *           type: integer
 *     RemoveUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized
 * tags:
 *   - name: Users
 *     description: User operations
 *   - name: Groups
 *     description: Group operations
 */
