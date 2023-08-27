// import request from "./main.js";
// import { LIMIT } from "./const.js";

const categoriesRow = document.querySelector(".categories-row");
const categorySearchInput = document.querySelector(
  ".category-search-input input"
);
const categoriesCount = document.querySelector(".categories-count");
const pagination = document.querySelector(".pagination");
const categoryForm = document.querySelector(".category-form");
const inputFirstNmae = document.querySelector(".inputFirstName");
const phoneNumber = document.querySelector(".phoneNumber");
const email = document.querySelector(".email");
const groups = document.querySelector(".group");
const chechbox = document.querySelector(".form-check-input");
const lastname = document.querySelector(".lastname");
const avatarimg = document.querySelector(".avatar_img");
const categoryModal = document.querySelector("#category-modal");
const addCategoryBtn = document.querySelector(".add-category-btn");
const addSaveCategoryBtn = document.querySelector(".add-save-category-btn");
const selectBtn = document.querySelector(".form-select");
const marriedfiltercheckbox = document.querySelector("maried__Select")
let search = "";
let activePage = 1;
let selected = null;

function getCategoryCard(teachers) {
  return `
      <div class=" card col-12 col-sm-6 col-md-4 col-lg-3 mb-3 ">
      <div class="card">
        <img src="${teachers.avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
 
          <h3 class="card-title">${teachers.FirstName}</h3>
          <h5 class="card-title">${teachers.LastName}</h5>
          <p>${teachers.email}</p>
          <p>${teachers.groups}</p>
          <p>${teachers.isMarried ? "Married" : "notmarried"}</p>
          <a class="tel" href="tel:${
            teachers.phoneNumber
          }"><span class="tel__name">Number:</span> ${teachers.phoneNumber}</a>
         <div class="btns">
          <button
            class="btn btn-primary edit-btn"
            data-bs-toggle="modal"
            data-bs-target="#category-modal"
            id="${teachers.id}"
            >Edit</
          >
          <button class="btn btn-danger delete-btn" id="${
            teachers.id
          }">Delete</button>
          <a href="Students.html?Students=${
            teachers.id
          }" class="btn btn-success"
            >Students</a>
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


// marriedfiltercheckbox.addEventListener("change", function () {
//   search = marriedfiltercheckbox.value;
//   getCategories()
// });


async function getCategories() {
  try {
    categoriesRow.innerHTML = "...loading";
    let params = { lastName: search };
    let paramsWithPagination = {
      FirstName: search,
      page: activePage,
      limit: LIMIT,
    };

    // all categories with search
    let { data } = await request.get("Teachers", { params });

    console.log(data);

    // categories with pagination
    let { data: dataWithPagination } = await request.get("Teachers", {
      params: paramsWithPagination,
    });

    if (selectBtn.value !== "all") {
      const sortOrder = selectBtn.value === "asc" ? 1 : -1;

      dataWithPagination.sort((a, b) => {
        const nameA = a.lastName;
        const nameB = b.lastName;

        if (nameA < nameB) return -1 * sortOrder;
        if (nameA > nameB) return 1 * sortOrder;
        return 0;
      });
      
    }

    // if (marriedfiltercheckbox.value !== "all") {
    //   dataWithPagination = data.filter((filters) => {
    //     if (marriedfiltercheckbox.value !== "true") {
    //       return filters.isMaried === true;
    //     } else {
    //       return filters.isMaried === false;
    //     }
    //   });
    // }
    // console.log(dataWithPagination);



    
    pagination;
    let pages = Math.ceil(data.length / LIMIT);

    

    pagination.innerHTML = `<li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }">
      <button page="-" class="page-link">Previous</button>
    </li>`;

    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `
        <li class="page-item ${
          i === activePage ? "active" : ""
        }"><button page="${i}" class="page-link">${i}</button></li>
      `;
    }

    pagination.innerHTML += `<li class="page-item ${
      activePage === pages ? "disabled" : ""
    }">
      <button page="+" class="page-link">Next</button>
    </li>`;

    if (selectBtn.value !== "all") {
      const sortOrder = selectBtn.value === "asc" ? 1 : -1;

      dataWithPagination.sort((a, b) => {
        const nameA = a.lastName;
        const nameB = b.lastName;

        if (nameA < nameB) return -1 * sortOrder;
        if (nameA > nameB) return 1 * sortOrder;
        return 0;
      });
    }

    categoriesCount.textContent = data.length;
    categoriesRow.innerHTML = "";

    // console.log(dataWithPagination);

    dataWithPagination.map((category) => {
      categoriesRow.innerHTML += getCategoryCard(category);
      console.log(category);
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

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page !== null) {
    if (page === "+") {
      activePage++;
    } else if (page === "-") {
      activePage--;
    } else {
      activePage = +page;
    }
    getCategories();
  }
});

categoryForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let categoryData = {
    FirstName: inputFirstNmae.value,
    LastName: lastname.value,
    avatarimg: avatarimg.value,
    isMarried: chechbox.value,
    phoneNumber: phoneNumber.value,
    email: email.value,
    groups: groups.value.split(" "),
  };
  if (selected === null) {
    await request.post("Teachers", categoryData);
  } else {
    await request.put(`Teachers/${selected}`, categoryData);
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
  groups.value = "";
  chechbox.check = false;
  addCategoryBtn.textContent = "Add Teacher";
});

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");

  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`Teachers/${id}`);
    console.log(data);
    inputFirstNmae.value = data.FirstName;
    lastname.value = data.LastName;
    avatarimg.value = data.avatarimg;
    phoneNumber.value = data.phoneNumber;
    chechbox.check = data.chechbox;
    email.value = data.email;
    addSaveCategoryBtn.textContent = "Save Teacher";
    console.log(data);
  }

  let checkDelete = e.target.classList.contains("delete-btn");
  if (checkDelete) {
    let deleteConfirm = confirm("Do you want to delete this teacher?");
    if (deleteConfirm) {
      await request.delete(`Teachers/${id}`);
      getCategories();
    }
  }
});
