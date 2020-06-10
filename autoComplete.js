const createAutoComplete = ({ root, renderOption }) => {
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
	const searchInput = root.querySelector(".input")
	const dropdown = root.querySelector(".dropdown")
	const resultWrapper = root.querySelector(".result")

	const onInput = async (event) => {
		const movies = await fetchData(event.target.value)
		if (!movies.length) {
			dropdown.classList.remove("is-active")
			return
		}
		resultWrapper.innerHTML = ""
		for (let movie of movies) {
			dropdown.classList.add("is-active")

			const option = document.createElement("a")
			option.classList.add("dropdown-item")
			option.innerHTML = renderOption(movie)
			option.addEventListener("click", () => {
				dropdown.classList.remove("is-active")
				searchInput.value = movie.Title
				onMovieSelect(movie)
			})
			resultWrapper.appendChild(option)
		}
	}
	searchInput.addEventListener("input", debounce(onInput, 500))

	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove("is-active")
		}
	})
}
