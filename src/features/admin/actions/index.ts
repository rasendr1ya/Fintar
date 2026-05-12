export { requireAdmin, getAdminStats } from "./auth";

export {
  getAllUnitsAdmin,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "./units";
export type { CreateUnitInput, UpdateUnitInput } from "./units";

export {
  getLessonsByUnit,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "./lessons";
export type { CreateLessonInput, UpdateLessonInput } from "./lessons";

export {
  getChallengesByLesson,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "./challenges";
export type { CreateChallengeInput, UpdateChallengeInput } from "./challenges";

export {
  getArticlesAdmin,
  getArticleByIdAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish,
  toggleFeature,
} from "./articles";
export type { CreateArticleInput, UpdateArticleInput } from "./articles";
