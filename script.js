/* =====================================================
   기억을 잇다
   전체 기능
===================================================== */


/* =====================================================
   SUPABASE 설정
=====================================================

   아래 두 값을 입력하면

   "내가 쓴 기억"
          ↓
   Supabase
          ↓
   같은 링크에 들어온 모든 사람

   구조로 공유됩니다.

   아직 입력하지 않아도 오류 팝업은 나오지 않습니다.
===================================================== */

const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

let db = null;


/* Supabase가 제대로 입력된 경우에만 연결 */

if (
  typeof window.supabase !== "undefined" &&
  SUPABASE_URL.trim() !== "" &&
  SUPABASE_ANON_KEY.trim() !== ""
) {

  try {

    db = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

  } catch (error) {

    console.error(
      "Supabase 초기화 오류:",
      error
    );

    db = null;

  }

}


/* =====================================================
   기본 상태
===================================================== */

let currentStep = 1;

let currentFilter = "전체";

let formData = {

  memory: "",
  emotion: "",
  feeling: "",
  reflection: "",
  category: ""

};


/* =====================================================
   예시 기억
=====================================================

   실제 학생의 답변이 아니라
   사이트 기능을 보여주기 위한 예시입니다.
===================================================== */

const sampleMemories = [

  {
    id: "sample-1",

    memory:
      "친구들이 내가 대회 준비로 힘들어할 때 몰래 간식을 준비해줬던 날",

    emotion:
      "고마움",

    feeling:
      "따뜻해요",

    reflection:
      "혼자서 노력하고 있다고 생각했는데 나를 응원해주는 사람들이 있다는 걸 알게 되었어요.",

    category:
      "우정",

    isSample:
      true
  },


  {
    id: "sample-2",

    memory:
      "가족들과 아무 계획 없이 근처 공원에 가서 늦게까지 이야기를 나눴던 날",

    emotion:
      "행복",

    feeling:
      "그리워요",

    reflection:
      "특별한 일이 없어도 함께 시간을 보내는 것 자체가 소중하다는 걸 느꼈어요.",

    category:
      "가족",

    isSample:
      true
  },


  {
    id: "sample-3",

    memory:
      "어려워서 포기하고 싶었던 문제를 끝까지 고민해서 결국 풀었던 순간",

    emotion:
      "뿌듯함",

    feeling:
      "행복해요",

    reflection:
      "처음부터 잘하지 못해도 끝까지 해보면 내가 생각했던 것보다 더 많은 것을 해낼 수 있다는 걸 알게 되었어요.",

    category:
      "성취",

    isSample:
      true
  },


  {
    id: "sample-4",

    memory:
      "발표를 앞두고 긴장했을 때 친구가 괜찮다고 계속 옆에서 이야기해줬던 날",

    emotion:
      "고마움",

    feeling:
      "따뜻해요",

    reflection:
      "힘든 순간에 누군가 곁에 있어주는 것만으로도 큰 위로가 될 수 있다는 걸 느꼈어요.",

    category:
      "위로",

    isSample:
      true
  },


  {
    id: "sample-5",

    memory:
      "예전에는 못하던 일을 연습한 뒤 혼자서 해냈던 순간",

    emotion:
      "뿌듯함",

    feeling:
      "편안해요",

    reflection:
      "조금씩이라도 계속 노력하면 이전의 나와 달라질 수 있다는 걸 발견했어요.",

    category:
      "성장",

    isSample:
      true
  },


  {
    id: "sample-6",

    memory:
      "힘들었던 날 선생님이 내 노력을 알아보고 잘하고 있다고 말해주셨던 순간",

    emotion:
      "고마움",

    feeling:
      "뭉클해요",

    reflection:
      "결과만 중요한 것이 아니라 내가 해온 과정도 누군가에게 의미가 있을 수 있다는 생각이 들었어요.",

    category:
      "감사",

    isSample:
      true
  }

];


/* =====================================================
   DOM
===================================================== */

const questions =
  document.querySelectorAll(".question");

const nextButton =
  document.getElementById("nextButton");

const prevButton =
  document.getElementById("prevButton");

const saveButton =
  document.getElementById("saveButton");

const clearButton =
  document.getElementById("clearButton");

const memoryInput =
  document.getElementById("memoryInput");

const reflectionInput =
  document.getElementById("reflectionInput");

const progressSteps =
  document.querySelectorAll(".progress-step");


/* =====================================================
   섹션 이동
===================================================== */

function goToSection(id) {

  const target =
    document.getElementById(id);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =====================================================
   STEP 표시
===================================================== */

function showStep(step) {

  if (step < 1) {
    step = 1;
  }

  if (step > 4) {
    step = 4;
  }

  currentStep = step;


  questions.forEach(function(question) {

    question.classList.remove("active");

  });


  const currentQuestion =
    document.querySelector(
      `.question[data-step="${currentStep}"]`
    );


  if (currentQuestion) {

    currentQuestion.classList.add("active");

  }


  progressSteps.forEach(
    function(stepElement, index) {

      stepElement.classList.toggle(
        "active",
        index === currentStep - 1
      );

    }
  );


  if (currentStep === 1) {

    prevButton.style.visibility =
      "hidden";

  } else {

    prevButton.style.visibility =
      "visible";

  }


  if (currentStep === 4) {

    nextButton.style.display =
      "none";

    saveButton.style.display =
      "block";

  } else {

    nextButton.style.display =
      "block";

    saveButton.style.display =
      "none";

  }

}


/* =====================================================
   STEP 1 → STEP 2
   STEP 2 → STEP 3
   STEP 3 → STEP 4
===================================================== */

nextButton.addEventListener(
  "click",
  function(event) {

    event.preventDefault();


    if (currentStep === 1) {

      formData.memory =
        memoryInput.value.trim();


      if (!formData.memory) {

        alert(
          "먼저 기억을 적어주세요."
        );

        memoryInput.focus();

        return;

      }

    }


    if (currentStep === 2) {

      if (!formData.emotion) {

        alert(
          "그때 느낀 감정을 선택해주세요."
        );

        return;

      }

    }


    if (currentStep === 3) {

      if (!formData.feeling) {

        alert(
          "지금 느끼는 감정을 선택해주세요."
        );

        return;

      }

    }


    if (currentStep < 4) {

      showStep(
        currentStep + 1
      );

    }

  }
);


/* =====================================================
   이전
===================================================== */

prevButton.addEventListener(
  "click",
  function(event) {

    event.preventDefault();


    if (currentStep > 1) {

      showStep(
        currentStep - 1
      );

    }

  }
);


/* =====================================================
   텍스트 입력
===================================================== */

memoryInput.addEventListener(
  "input",
  function() {

    formData.memory =
      this.value;

    saveDraft();

  }
);


reflectionInput.addEventListener(
  "input",
  function() {

    formData.reflection =
      this.value;

    saveDraft();

  }
);


/* =====================================================
   선택 버튼
===================================================== */

document
  .querySelectorAll(
    ".choice-grid button, .category-grid button"
  )
  .forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        const type =
          this.dataset.type;

        const value =
          this.dataset.value;


        document
          .querySelectorAll(
            `button[data-type="${type}"]`
          )
          .forEach(
            function(item) {

              item.classList.remove(
                "selected"
              );

            }
          );


        this.classList.add(
          "selected"
        );


        formData[type] =
          value;


        saveDraft();

      }
    );

  });


/* =====================================================
   작성 중인 내용 저장
===================================================== */

function saveDraft() {

  localStorage.setItem(
    "memoryDraft",
    JSON.stringify(formData)
  );

}


/* =====================================================
   작성 중인 내용 복구
===================================================== */

function restoreDraft() {

  const saved =
    localStorage.getItem(
      "memoryDraft"
    );


  if (!saved) {
    return;
  }


  try {

    const data =
      JSON.parse(saved);


    formData = {

      ...formData,
      ...data

    };


    memoryInput.value =
      formData.memory || "";


    reflectionInput.value =
      formData.reflection || "";


    restoreSelected(
      "emotion",
      formData.emotion
    );


    restoreSelected(
      "feeling",
      formData.feeling
    );


    restoreSelected(
      "category",
      formData.category
    );

  } catch(error) {

    console.error(
      "작성 내용 복구 오류:",
      error
    );

  }

}


/* =====================================================
   선택 복구
===================================================== */

function restoreSelected(
  type,
  value
) {

  if (!value) {
    return;
  }


  const button =
    document.querySelector(
      `button[data-type="${type}"][data-value="${CSS.escape(value)}"]`
    );


  if (button) {

    button.classList.add(
      "selected"
    );

  }

}


/* =====================================================
   기억 저장
===================================================== */

saveButton.addEventListener(
  "click",
  async function() {

    formData.memory =
      memoryInput.value.trim();

    formData.reflection =
      reflectionInput.value.trim();


    if (!formData.memory) {

      alert(
        "기억을 적어주세요."
      );

      showStep(1);

      memoryInput.focus();

      return;

    }


    if (!formData.emotion) {

      alert(
        "그때 느낀 감정을 선택해주세요."
      );

      showStep(2);

      return;

    }


    if (!formData.feeling) {

      alert(
        "지금 느끼는 감정을 선택해주세요."
      );

      showStep(3);

      return;

    }


    if (!formData.reflection) {

      alert(
        "그 경험을 통해 발견한 나의 모습을 적어주세요."
      );

      showStep(4);

      reflectionInput.focus();

      return;

    }


    if (!formData.category) {

      alert(
        "기억의 카테고리를 선택해주세요."
      );

      showStep(4);

      return;

    }


    const memory = {

      memory:
        formData.memory,

      emotion:
        formData.emotion,

      feeling:
        formData.feeling,

      reflection:
        formData.reflection,

      category:
        formData.category,

      created_at:
        new Date().toISOString()

    };


    saveButton.disabled =
      true;

    saveButton.textContent =
      "저장 중...";


    try {

      /* ==============================================
         SUPABASE 저장
      ============================================== */

      if (db) {

        const {
          error
        } = await db
          .from("memories")
          .insert([memory]);


        if (error) {

          console.error(
            "Supabase 저장 오류:",
            error
          );

          alert(
            "기억을 저장하지 못했습니다."
          );

          return;

        }

      }


      /* ==============================================
         Supabase가 없을 경우
         현재 브라우저에 저장
      ============================================== */

      else {

        const memories =
          getLocalMemories();


        memories.unshift({

          ...memory,

          id:
            Date.now(),

          isSample:
            false

        });


        localStorage.setItem(
          "memories",
          JSON.stringify(memories)
        );

      }


      /* ==============================================
         작성 내용 초기화
      ============================================== */

      localStorage.removeItem(
        "memoryDraft"
      );


      formData = {

        memory: "",
        emotion: "",
        feeling: "",
        reflection: "",
        category: ""

      };


      memoryInput.value =
        "";

      reflectionInput.value =
        "";


      document
        .querySelectorAll(
          ".choice-grid button, .category-grid button"
        )
        .forEach(
          function(button) {

            button.classList.remove(
              "selected"
            );

          }
        );


      alert(
        "소중한 기억이 기록되었습니다. 🤍"
      );


      showStep(1);


      await loadMemories();


      goToSection(
        "archive"
      );


    } catch(error) {

      console.error(
        "기억 저장 오류:",
        error
      );

      alert(
        "기억을 저장하는 중 문제가 발생했습니다."
      );

    } finally {

      saveButton.disabled =
        false;

      saveButton.textContent =
        "기억 남기기";

    }

  }
);


/* =====================================================
   로컬 기억 가져오기
===================================================== */

function getLocalMemories() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "memories"
      ) || "[]"
    );

  } catch(error) {

    console.error(error);

    return [];

  }

}


/* =====================================================
   기억 불러오기
===================================================== */

async function loadMemories() {

  let userMemories = [];


  /* ==============================================
     Supabase
  ============================================== */

  if (db) {

    try {

      const {
        data,
        error
      } = await db
        .from("memories")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


      if (!error) {

        userMemories =
          data || [];

      } else {

        console.error(
          "기억 불러오기 오류:",
          error
        );

      }

    } catch(error) {

      console.error(
        error
      );

    }

  }


  /* ==============================================
     로컬
  ============================================== */

  else {

    userMemories =
      getLocalMemories();

  }


  /*
     예시 기억 + 실제 기억

     실제 기억이 생겨도 예시 기억은
     사이트의 기본 전시용으로 남겨둡니다.
  */

  const memories = [

    ...sampleMemories,

    ...userMemories

  ];


  renderMemories(
    memories
  );

}


/* =====================================================
   기억 렌더링
===================================================== */

function renderMemories(
  memories
) {

  let filtered =
    memories;


  if (
    currentFilter !== "전체"
  ) {

    filtered =
      memories.filter(
        function(item) {

          return (
            item.category ===
            currentFilter
          );

        }
      );

  }


  const count =
    document.getElementById(
      "memoryCount"
    );


  if (count) {

    count.textContent =
      filtered.length;

  }


  const list =
    document.getElementById(
      "memoryList"
    );


  if (!list) {
    return;
  }


  if (
    filtered.length === 0
  ) {

    list.innerHTML = `

      <div class="empty">

        아직 이 카테고리에 기록된 기억이 없어요.

      </div>

    `;

    return;

  }


  list.innerHTML =
    filtered
      .map(
        function(item, index) {

          const sampleClass =
            item.isSample
              ? "sample-card"
              : "";


          const sampleLabel =
            item.isSample
              ? "EXAMPLE"
              : "MEMORY";


          return `

            <article
              class="memory-card ${sampleClass}"
            >

              <div class="memory-number">

                ${sampleLabel}
                #${index + 1}

              </div>


              <h3>

                ${escapeHTML(
                  item.memory
                )}

              </h3>


              <div class="memory-detail">

                그때의 감정 ·
                ${escapeHTML(
                  item.emotion
                )}

              </div>


              <div class="memory-detail">

                지금의 마음 ·
                ${escapeHTML(
                  item.feeling
                )}

              </div>


              <div class="memory-detail">

                기억이 남긴 생각 ·
                ${escapeHTML(
                  item.reflection
                )}

              </div>


              <span class="category">

                ${escapeHTML(
                  item.category
                )}

              </span>

            </article>

          `;

        }
      )
      .join("");

}


/* =====================================================
   필터
===================================================== */

document
  .querySelectorAll(
    ".filter"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          document
            .querySelectorAll(
              ".filter"
            )
            .forEach(
              function(item) {

                item.classList.remove(
                  "active"
                );

              }
            );


          this.classList.add(
            "active"
          );


          currentFilter =
            this.dataset.filter;


          loadMemories();

        }
      );

    }
  );


/* =====================================================
   새로고침 버튼
===================================================== */

const refreshButton =
  document.getElementById(
    "refreshButton"
  );


if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    function() {

      loadMemories();

    }
  );

}


/* =====================================================
   작성 내용 초기화
===================================================== */

clearButton.addEventListener(
  "click",
  function() {

    const confirmed =
      confirm(
        "현재 작성 중인 내용을 모두 지울까요?"
      );


    if (!confirmed) {
      return;
    }


    localStorage.removeItem(
      "memoryDraft"
    );


    formData = {

      memory: "",
      emotion: "",
      feeling: "",
      reflection: "",
      category: ""

    };


    memoryInput.value =
      "";

    reflectionInput.value =
      "";


    document
      .querySelectorAll(
        ".choice-grid button, .category-grid button"
      )
      .forEach(
        function(button) {

          button.classList.remove(
            "selected"
          );

        }
      );


    showStep(1);

  }
);


/* =====================================================
   공감 버튼
===================================================== */

function showReaction(
  message
) {

  alert(
    message
  );

}


/* =====================================================
   HTML escape
===================================================== */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =====================================================
   초기 실행
===================================================== */

restoreDraft();

showStep(1);

loadMemories();


/* =====================================================
   10초마다 공유 기억 확인
===================================================== */

setInterval(
  function() {

    loadMemories();

  },
  10000
);
