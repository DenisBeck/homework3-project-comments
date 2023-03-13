import { appModules } from "./modules.js";        
import Comment from "./commentsClass.js";                                                                                                                                         
import "./form.js";

Comment.initComments();

appModules.commentForm.formFieldsInit();
appModules.commentForm.formSubmit();

appModules.toggleActiveClass();
appModules.removeComment();
