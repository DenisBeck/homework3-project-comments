import Comment from "./commentsClass.js"; 

export const appModules = {
    toggleActiveClass: function() {
        const comments = Comment.commentsArray;
        for(let comment of comments) {
            let toggleElement = document.querySelector(`[data-count="${comment.element.count}"][class="${comment.element.class}"] .comments-item__like`);
            if(comment.isLiked) {
                toggleElement.classList.add('_active');
            } else {
                toggleElement.classList.remove('_active');
            }
            toggleElement.addEventListener('click', function() {
                this.classList.toggle('_active');
                comment.likeComment();
            })
        }
    },
    removeComment: function() {
        const comments = Comment.commentsArray;
        for(let comment of comments) {
            let commentElement = document.querySelector(`[data-count="${comment.element.count}"][class="${comment.element.class}"]`);
            let commentDelete = commentElement.querySelector('.comments-item__delete');
            commentDelete.addEventListener('click', function() {
                commentElement.remove();
                comment.deleteComment();
            })
        }
    }
}