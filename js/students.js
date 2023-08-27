const StudentsPage = new URLSearchParams(location.search)
const studentId = StudentsPage.get('Students')

const categoriesRow = document.querySelector(".categories-row");
const categorySearchInput = document.querySelector(
  ".category-search-input input"
);
const categoriesCount = document.querySelector(".categories-count");
// const pagination = document.querySelector(".pagination");
const categoryForm = document.querySelector(".category-form");
const inputFirstNmae = document.querySelector(".inputFirstName");
const phoneNumber = document.querySelector(".phoneNumber");
const email = document.querySelector(".email");
const field = document.querySelector(".field");
const birthday = document.querySelector(".birthday");
const chechbox = document.querySelector(".form-check-input");
const lastname = document.querySelector(".lastname");
const avatarimg = document.querySelector(".avatar_img");
const categoryModal = document.querySelector("#category-modal");
const addCategoryBtn = document.querySelector(".add-category-btn");
const addSaveCategoryBtn = document.querySelector(".add-save-category-btn");
const selectBtn = document.querySelector(".form-check-input");
let search = "";
let selected = null;

function getCategoryCard(Students) {
  return `
      <div class=" card col-12 col-sm-6 col-md-4 col-lg-3 mb-3 ">
      <div class="card">
        <img src="${Students.avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h3 class="card-title">${Students.FirstNmae}</h3>
          <h5 class="card-title">${Students.LastName}</h5>
          <p>${Students.email}</p>
          <p>${Students.birthday}</p>
          <p>${Students.field}</p>
          <p>${Students.isWork ? "Work" : "notwork"}</p>
          <a class="tel" href="tel:${Students.phoneNumber}"><span class="tel__name">Number:</span> ${Students.phoneNumber}</a>
         <div class="btns">
          <button
            class="btn btn-primary edit-btn"
            data-bs-toggle="modal"
            data-bs-target="#category-modal"
            id="${Students.id}"
            >Edit</
          >
          <button class="btn btn-danger delete-btn" id="${Students.id}">Delete</button>
         </div>
        </div>
      </div>
    </div
  `;
}

selectBtn.addEventListener("change", function () {
  search = categorySearchInput.value;

  getCategories();
});

async function getCategories() {
  try {
    categoriesRow.innerHTML = "...loading";
    let params = { lastName: search };
  

    // all categories with search
    let { data } = await request.get(`Teachers/${studentId}/Students`, { params });

    console.log(data);

    categoriesCount.textContent = data.length;
    categoriesRow.innerHTML = "";

    // console.log(dataWithPagination);

    data.map((Students) => {
      categoriesRow.innerHTML += getCategoryCard(Students);
      console.log(Students);
    });
  } catch (err) {
    console.log(err);
  }
}

getCategories();

categorySearchInput.addEventListener("keyup", function () {
  search = this.value;
  getCategories();
});



categoryForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let categoryData = {
    FirstName: inputFirstNmae.value,
    lastname: lastname.value,
    avatarimg: avatarimg.value,
    isWork: chechbox.value,
    phoneNumber: phoneNumber.value,
    field: field.value,
    email: email.value,
    birthday: birthday.value
  };
if (selected === null) {
    await request.post(`/Teachers/${studentId}/Students`, categoryData);
  } else {
    await request.put(`Teachers/${studentId}/Students/${selected}`,  categoryData);
  }
  getCategories();
  bootstrap.Modal.getInstance(categoryModal).hide();
});

addCategoryBtn.addEventListener("click", () => {
  selected = null;
  inputFirstNmae.value = "";
  avatarimg.value = "";
  lastname.value = "";
  phoneNumber.value = "";
  email.value = "";
  field.value = "";
  groups.value = "";
  birthday.value = "";
  chechbox.check = false;
  addCategoryBtn.textContent = "Add Student";
});

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  e.preventDefault

  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`Teachers/${studentId}/Students/${id}`);
    console.log(data);
    inputFirstNmae.value = data.FirstNmae
    lastname.value = data.LastName;
    avatarimg.value = data.avatarimg;
    phoneNumber.value = data.phoneNumber;
    chechbox.check = data.chechbox;
    email.value = data.email;
    field.value = data.field;
    birthday.value = data.birthday;
    addSaveCategoryBtn.textContent = "Save Student";
    console.log(data);
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this student?");
    if (deleteConfirm) {
      await request.delete(`Teachers/${studentId}/Students/${id}`);
      getCategories();
    }
  }
});
