import dayjs from 'dayjs';
import he from 'he';
import {generateRuntime} from '../utils/film-card-data.js';
import Smart from '../view/smart.js';

const DEFAULT_NEW_COMMENT = {
  comment: '',
  emotion: null,
  date: '',
};

const createCommentTemplate = (commentData, isDeleting, isDisabled) => {
  const {
    author,
    comment,
    date,
    emotion,
    id,
  } = commentData;

  const commentDate = dayjs(date).format('YYYY/MM/DD HH:mm');

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button type='button' class="film-details__comment-delete" data-id="${id}"${isDisabled ? ' disabled' : ''}>
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`;
};

const isChecked = (isChecked) => isChecked ? ' checked' : '';

const createDetailedFilmCardTemplate = (movie, movieComments) => {
  const {
    comments,
    filmInfo,
    userDetails,
    isDisabled,
    deletingId,
    newComment,
  } = movie;

  const {
    description,
    genres,
    poster,
    release,
    runtime,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    ageRating,
  } = filmInfo;

  const {
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
  } = userDetails;

  const {
    date,
    releaseCountry,
  } = release;

  const movieWriters = writers.join(', ');
  const movieActors = actors.join(', ');
  const releaseDate = dayjs(date).format('DD MMMM YYYY');
  const movieRuntime = generateRuntime(runtime);
  const genresTerm = genres.length > 2 ? 'Genres' : 'Genre';
  const movieGenres = genres.length > 2
    ? `${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`
    : `<span class="film-details__genre">${genres[0]}</span>`;

  const watchlistChecked = isChecked(isWatchlist);
  const alreadyWatchedChecked = isChecked(isAlreadyWatched);
  const favoriteChecked = isChecked(isFavorite);

  const commentsCount = !movieComments.length ? '0' : movieComments.length;

  const commentsList = movieComments
    .sort((a, b) => {
      const date1 = dayjs(a.date);
      const date2 = dayjs(b.date);

      return date1.diff(date2);
    });

  const commentFragment = comments.length
    ? commentsList.map((comment) => createCommentTemplate(comment, comment.id === String(deletingId), isDisabled)).join('')
    : '';

  const {emotion, comment} = newComment;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${movieWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${movieActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${movieRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresTerm}</td>
                <td class="film-details__cell">
                  ${movieGenres}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistChecked}${isDisabled ? ' disabled' : ''}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatchedChecked}${isDisabled ? ' disabled' : ''}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteChecked}${isDisabled ? ' disabled' : ''}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentFragment}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${isDisabled ? ' disabled' : ''}>${he.encode(comment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"${emotion === 'smile' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"${emotion === 'sleeping' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"${emotion === 'puke' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"${emotion === 'angry' ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class DetailedFilmCard extends Smart {
  constructor(film, comments) {
    super();
    this._data = DetailedFilmCard.parseFilmToData(film);
    this._comments = comments;
    this._updatedComments = null;
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._addToWatchlistInPopupClickHandler = this._addToWatchlistInPopupClickHandler.bind(this);
    this._favoriteInPopupClickHandler = this._favoriteInPopupClickHandler.bind(this);
    this._watchedInPopupClickHandler = this._watchedInPopupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._documentEnterKeyDownHandler = this._documentEnterKeyDownHandler.bind(this);
    this._сommentEmojiСhangeHandler = this._сommentEmojiСhangeHandler.bind(this);
    this._сommentInputHandler = this._сommentInputHandler.bind(this);
    this._deleteCommentButtonClickHandler = this._deleteCommentButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createDetailedFilmCardTemplate(this._data, this._comments);
  }

  updateNewCommentImput(newComment) {
    const {comment, emotion} = newComment;

    if (!emotion && !comment) {
      return;
    }

    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          comment,
          emotion,
        },
      ),
    });
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _favoriteInPopupClickHandler(evt) {
    evt.preventDefault();
    const {comment, emotion} = this._data.newComment;

    this._callback.favoriteInPopupClick(comment, emotion);
  }

  _addToWatchlistInPopupClickHandler(evt) {
    evt.preventDefault();
    const {comment, emotion} = this._data.newComment;

    this._callback.addToWatchlistInPopupClick(comment, emotion);
  }

  _watchedInPopupClickHandler(evt) {
    evt.preventDefault();
    const {comment, emotion} = this._data.newComment;

    this._callback.watchedInPopupClick(comment, emotion);
  }

  _formSubmitHandler() {
    if (this._data.isDisabled) {
      return;
    }

    const {comment, emotion} = this._data.newComment;

    if (!comment.trim() || !emotion) {
      return;
    }

    const update = DetailedFilmCard.parseDataToComment(this._data);
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        DEFAULT_NEW_COMMENT,
      ),
    }, true);

    this._callback.formSubmit(update);
  }

  _documentEnterKeyDownHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this._formSubmitHandler();
    }
  }

  _сommentEmojiСhangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          emotion: evt.target.value,
        },
      ),
    });
  }

  _сommentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          comment: evt.target.value,
        },
      ),
    }, true);
  }

  _deleteCommentButtonClickHandler(evt) {
    evt.preventDefault();
    const {comment, emotion} = this._data.newComment;
    const deletedCommentId = +evt.target.dataset.id;

    this._callback.deleteCommentBtnClick(comment, emotion, deletedCommentId);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((item) => item.addEventListener('change', this._сommentEmojiСhangeHandler));

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._сommentInputHandler);
  }

  setDeleteCommentButtonClickHandler(callback) {
    this._callback.deleteCommentBtnClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((item) => item.addEventListener('click', this._deleteCommentButtonClickHandler));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this._documentEnterKeyDownHandler);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeBtnClickHandler);
  }

  setFavoriteInPopupClickHandler(callback) {
    this._callback.favoriteInPopupClick = callback;
    this.getElement()
      .querySelector('#favorite')
      .addEventListener('click', this._favoriteInPopupClickHandler);
  }

  setAddToWatchlistInPopupClickHandler(callback) {
    this._callback.addToWatchlistInPopupClick = callback;
    this.getElement()
      .querySelector('#watchlist')
      .addEventListener('click', this._addToWatchlistInPopupClickHandler);
  }

  setWatchedInPopupClickHandler(callback) {
    this._callback.watchedInPopupClick = callback;
    this.getElement()
      .querySelector('#watched')
      .addEventListener('click', this._watchedInPopupClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setAddToWatchlistInPopupClickHandler(this._callback.addToWatchlistInPopupClick);
    this.setFavoriteInPopupClickHandler(this._callback.favoriteInPopupClick);
    this.setWatchedInPopupClickHandler(this._callback.watchedInPopupClick);
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteCommentButtonClickHandler(this._callback.deleteCommentBtnClick);
  }

  removeHandlers() {
    document.removeEventListener('keydown', this._documentEnterKeyDownHandler);
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      newComment: DEFAULT_NEW_COMMENT,
      isDisabled: false,
      deletingId: null,
    });
  }

  static parseDataToComment(data) {
    data = Object.assign({}, data);
    delete data.isDisabled;
    delete data.deletingId;

    return {
      comment: data.newComment.comment,
      emotion: data.newComment.emotion,
      filmId: data.id,
    };
  }
}
