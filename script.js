const warpper = document.querySelector(".img");
const load = document.querySelector(".load");
const inp = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const close = lightbox.querySelector(".ri-close-line");
const dbtn = lightbox.querySelector(".ri-download-2-fill");

const api = "46vvPZpBRw2wqfhUYtJbw1n2nfJxiSHeIAeNgwSLJDnE41EsnwAVguJ2";

const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const download = (imgURL) => {
    fetch(imgURL)
    .then(res =>res.blob())
    .then(file =>{
        console.log(file);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    })
    .catch(()=> alert("Failed to download"));
}

const showbox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerHTML = name;
    dbtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const closebox = ()=>{
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const genarateHTML =(images)=>{
    warpper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showbox('${img.photographer}', '${img.src.large2x}' )">
        <img src=${img.src.large2x} alt="">
        <div class="dets">
            <div class="phpto">
                <i class="ri-camera-fill"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick = "download('${img.src.large2x}');event.stopPopagation();">
                <i class="ri-download-2-fill"></i>
            </button>
        </div>
    </li>`
    ).join("");
}

const getImg = (apiURL) => {
    load.innerHTML = "Loading...";
    load.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: api}
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        genarateHTML(data.photos);
        load.innerHTML = "Load More";
        load.classList.remove("disabled");
    })
    .catch(()=> alert("Failed to load images!"))
}

const loadMore = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImg(apiURL);
}

const search =(e) =>{
    if(e.target.value === "") return searchTerm = null;
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        warpper.innerHTML = "";
        getImg(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}


getImg(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

load.addEventListener("click", loadMore);
inp.addEventListener("keyup", search);
close.addEventListener("click", closebox);
dbtn.addEventListener("click", (e)=> download(e.target.dataset.img));