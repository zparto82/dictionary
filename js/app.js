const originTextInput = document.getElementById("origin-text-input");
const translatedTextInput = document.getElementById("translated-text-input");
const saveWordBtn = document.getElementById("save-word-btn");
const openIframeBtn = document.getElementById("open-iframe-btn");
const wordsList = document.getElementById("words-list");
const loaderContainer = document.querySelector(".loader-container");

const cover = document.getElementById("cover");
const iFrame = document.getElementById("iframe");

let wordsArray = null;

const getWordsFromDB = () => {
  fetch("https://670cf1997e5a228ec1d2085c.mockapi.io/api/v1/words")
    .then((res) => res.json())
    .then((res) => {
      wordsArray = res;
      wordsGenerator();
    });
};

const saveWordInDB = () => {
  if (originTextInput.value.trim() && translatedTextInput.value.trim()) {
    saveWordBtn.innerHTML = '<div class="btn-loader"></div>';
    let isHaveThisWord = wordsArray.some(
      (word) => word.word === originTextInput.value.trim()
    );

    if (!isHaveThisWord) {
      let newWordInfo = {
        word: originTextInput.value.trim(),
        translated: translatedTextInput.value.trim(),
      };

      fetch("https://670cf1997e5a228ec1d2085c.mockapi.io/api/v1/words", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newWordInfo),
      }).then((res) => {
        getWordsFromDB();
        saveWordBtn.innerHTML = "ذخیره";
      });

      originTextInput.value = "";
      translatedTextInput.value = "";
    }
  }
};

const wordsGenerator = () => {
  wordsList.innerHTML = "";
  if (wordsArray.length) {
    wordsArray
      .sort(() => 0.5 - Math.random())
      .forEach((word, index) => {
        wordsList.insertAdjacentHTML(
          "beforeend",
          `<li>
        <span>${index + 1}_ ${word.word}: 
            <span class="translted-txt translted-txt-${word.id}">${
            word.translated
          }</span>
        </span>
        
        <div>
            <button class="hide-translted-btn" id="${word.id}">پنهان</button>
            <button class="remove-word-btn" id="${word.id}">حذف</button>
        </div>
      </li>`
        );
      });

    let removeWordBtns = document.querySelectorAll(".remove-word-btn");
    let hideWordBtns = document.querySelectorAll(".hide-translted-btn");
    let hideAllWordsBtn = document.querySelector("#hide-allWords-btn");

    removeWordBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        removeWordHandler(btn);
      })
    );
    hideWordBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        const mainBtn = document.querySelector(`.translted-txt-${btn.id}`);
        mainBtn.classList.toggle("hide");

        if (mainBtn.className.includes("hide")) {
          btn.innerHTML = "نمایش";
        } else {
          btn.innerHTML = "پنهان";
          hideAllWordsBtn.classList.remove("hide");
          hideAllWordsBtn.innerHTML = "پنهان همه";
        }
      })
    );

    hideAllWordsBtn.addEventListener("click", () => {
      let mainBtn = null;

      hideAllWordsBtn.classList.toggle("hide");

      hideWordBtns.forEach((hideBtn, index) => {
        mainBtn = document.querySelector(`.translted-txt-${hideBtn.id}`);

        if (hideAllWordsBtn.className.includes("hide")) {
          hideBtn.innerHTML = "نمایش";
          mainBtn.classList.add("hide");
        } else {
          hideBtn.innerHTML = "پنهان";
          mainBtn.classList.remove("hide");
        }
      });

      if (hideAllWordsBtn.innerHTML === "پنهان همه") {
        hideAllWordsBtn.innerHTML = "نمایش همه";
      } else {
        hideAllWordsBtn.innerHTML = "پنهان همه";
      }
    });
  } else {
    wordsList.insertAdjacentHTML(
      "beforeend",
      `<li class="nothing"><h2>هیچ کلمه ای نیست!</h2></li>`
    );
  }
  loaderContainer.classList.add("hide");
};

saveWordBtn.addEventListener("click", () => {
  saveWordInDB();
});

const removeWordHandler = (btn) => {
  const wantRemove = confirm("آیا کلمه را حذف میکنید؟");
  const wordId = btn.id;
  if (wantRemove) {
    btn.innerHTML = '<div class="btn-loader"></div>';

    fetch(
      `https://670cf1997e5a228ec1d2085c.mockapi.io/api/v1/words/${wordId}`,
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      }
    ).then(() => {
      getWordsFromDB();
    });
  }
};

originTextInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    translatedTextInput.focus();
  }
});
translatedTextInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    saveWordInDB();
    originTextInput.focus();
  }
});

openIframeBtn.addEventListener("click", () => {
  cover.classList.add("show");
  iframe.classList.add("show");
});
cover.addEventListener("click", () => {
  cover.classList.remove("show");
  iframe.classList.remove("show");
});

window.addEventListener("load", () => {
  getWordsFromDB();
});
