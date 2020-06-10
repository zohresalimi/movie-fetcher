const createAutoComplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
}) => {
	root.innerHTML = `
        <lable><b>Search</b></lable>
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
		const items = await fetchData(event.target.value)
		if (!items.length) {
			dropdown.classList.remove("is-active")
			return
		}
		resultWrapper.innerHTML = ""
		for (let item of items) {
			dropdown.classList.add("is-active")

			const option = document.createElement("a")
			option.classList.add("dropdown-item")
			option.innerHTML = renderOption(item)
			option.addEventListener("click", () => {
				dropdown.classList.remove("is-active")
				searchInput.value = inputValue(item)
				onOptionSelect(item)
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
