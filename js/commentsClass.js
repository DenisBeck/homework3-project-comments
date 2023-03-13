import { appModules } from "./modules.js";

export default class Comment {
    
    constructor(options) {
        this.text = options.text;
        this.author = options.author;
        this.date = options.date;
        this.element = options.element;
        this.isLiked = options.isLiked || false;
    }
    
    static commentsArray = [];

    static initComments() {
        const getComments = function() {
            const commentObjects = [];
            let comments = document.querySelectorAll('.comments-item');
            for(let i = 0; i < comments.length; i++) {
                let comment = comments[i];  
                let now = new Date();
                comment.setAttribute('data-count', i);
                let text = comment.querySelector('.comments-item__text').innerHTML;
                let author = comment.querySelector('.comments-item__name').innerHTML;
                let day = `${now.getFullYear()}-${(now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1)}-${(now.getDate() < 10 ? '0' : '') + now.getDate()}`;
                let time = comment.querySelector('.comments-item__date .time').innerHTML;
                const options = {
                    text,
                    author,
                    date: {
                        day,
                        time
                    },
                    element: {
                        count: comment.getAttribute('data-count'),
                        class: comment.getAttribute('class')  
                    }
                }
                commentObjects.push(new Comment(options)); 
            }
            return commentObjects;
        }
        if(localStorage.comments) {
            Comment.commentsArray = JSON.parse(localStorage.comments).map(item => new Comment(item));
            let commentsParent = document.querySelector('.comments__list');
            commentsParent.innerHTML = '';
            for(let i = 0; i < Comment.commentsArray.length; i++) {
                let comment = Comment.commentsArray[i].createComment();
                comment.setAttribute('data-count', i);
                commentsParent.append(comment);
            }                                                           
            // appModules.toggleActiveClass();
            // appModules.removeComment();
        } else {
            Comment.commentsArray = getComments();
        }
        localStorage.comments = JSON.stringify(Comment.commentsArray);
    }

    static addComment(comment) {
        comment.element = {
            class: 'comments__item comments-item',
            count: Comment.commentsArray.length
        }
        Comment.commentsArray.push(new Comment(comment));
        localStorage.comments = JSON.stringify(Comment.commentsArray);
        Comment.initComments();
    }

    createComment() {
        let day = this.updateDate(this.date.day);

        let li = document.createElement('li');
        li.classList.add('comments__item');
        li.classList.add('comments-item');

        let topDiv = document.createElement('div');
        topDiv.classList.add('comments-item__top');
        let nameDiv = document.createElement('div');
        nameDiv.classList.add('comments-item__name');
        nameDiv.innerHTML = this.author;
        topDiv.append(nameDiv);
        let likeDiv = document.createElement('div');
        likeDiv.classList.add('comments-item__like');
        likeDiv.innerHTML = '<span class="icon-heart"></span><span>Нравится</span>';
        topDiv.append(likeDiv)
        li.append(topDiv);

        let textDiv = document.createElement('div');
        textDiv.classList.add('comments-item__text');
        textDiv.innerHTML = this.text;
        li.append(textDiv);

        let bottomDiv = document.createElement('div');
        bottomDiv.classList.add('comments-item__bottom');
        let dateDiv = document.createElement('div');
        dateDiv.classList.add('comments-item__date');

        let daySpan = document.createElement('span');
        daySpan.classList.add('day');
        daySpan.innerHTML = day;
        dateDiv.append(daySpan);
        let timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.innerHTML = this.date.time;
        dateDiv.append(timeSpan)

        bottomDiv.append(dateDiv);
        let deleteDiv = document.createElement('div');
        deleteDiv.classList.add('comments-item__delete');
        deleteDiv.innerHTML = '<span class="icon-trash-o"></span><span>Удалить комментарий</span>';
        bottomDiv.append(deleteDiv)
        li.append(bottomDiv);

        return li;
    }

    deleteComment() {
        const comments = Comment.commentsArray
        for(let i = 0; i < comments.length; i++) {
            if(this === comments[i]) {
                Comment.commentsArray.splice(i, 1);
            }
        }
        localStorage.comments = JSON.stringify(Comment.commentsArray);
    }

    likeComment() {
        this.isLiked = this.isLiked ? false : true;
        localStorage.comments = JSON.stringify(Comment.commentsArray);
    }

    updateDate(day) {
        let dayString = '' + day;
        let date = new Date(day);
        let now = new Date();
        if(now.getDate() - date.getDate() < 1) {
            dayString = 'Сегодня';
        } else if(now.getDate() - date.getDate() < 2) {
            dayString = 'Вчера ';
        }
        return dayString;
    }
}