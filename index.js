const fetchData = async (searchTerm) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "20e5b8ea",
			s: searchTerm,
		},
	})
	if (response.data.Error) {
		return []
	}
	return response.data.Search
}

const onInput = async (event) => {
	const movies = await fetchData(event.target.value)
	resultWrapper.innerHTML = ""
	for (movie of movies) {
		dropdown.classList.add("is-active")
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster

		const option = document.createElement("a")
		option.classList.add("dropdown-item")
		option.innerHTML = `
            <img src="${imgSrc}"/>
            ${movie.Title} 
        `
		resultWrapper.appendChild(option)
	}
}

const root = document.querySelector(".autocomplete")
root.innerHTML = `
    <lable><b>Search For a Movie</b></lable>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content result">
            </div>
        </div>
    </div>
`

const searchInput = document.querySelector(".input")
const dropdown = document.querySelector(".dropdown")
const resultWrapper = document.querySelector(".result")
searchInput.addEventListener("input", debounce(onInput, 500))

document.addEventListener("click", (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove("is-active")
	}
})
