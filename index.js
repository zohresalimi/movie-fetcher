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
let leftMovie
let rightMovie
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "20e5b8ea",
			i: movie.imdbID,
		},
	})
	summaryElement.innerHTML = movieTemplate(response.data)
	if (side === "left") {
		leftMovie = response.data
	} else {
		rightMovie = response.data
	}
	if (leftMovie && rightMovie) {
		runComparison()
	}
}

const runComparison = () => {
	const leftSideStats = document.querySelectorAll(
		"#left-summary .notification"
	)
	const rightSideStats = document.querySelectorAll(
		"#right-summary .notification"
	)
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index]

		const leftSideValue = parseInt(leftStat.dataset.value)
		const rightSideValue = parseInt(rightStat.dataset.value)

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove("is-primary")
			leftStat.classList.add("is-warning")
		} else {
			rightStat.classList.remove("is-primary")
			rightStat.classList.add("is-warning")
		}
	})
}

const movieTemplate = (movieDetail) => {
	const [dollar, metascore, imdbRating, imdbVotes] = [
		"BoxOffice",
		"Metascore",
		"imdbRating",
		"imdbVotes",
	].map((item) => {
		const value = movieDetail[item]
		if (!value) {
			return
		}
		if (value !== "N/A") {
			if (value.indexOf("$") !== -1) {
				return parseInt(value.replace(/[\$,] /g, ""))
			}

			return parseInt(value)
		}
	})
	const awards = movieDetail.Awards.split(" ").reduce((acc, item) => {
		const value = parseInt(item)
		if (isNaN(value)) {
			return acc
		} else {
			return acc + value
		}
	}, 0)
	return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1> ${movieDetail.Title} </h1>
                    <h4> ${movieDetail.Genre} </h4>
                    <p> ${movieDetail.Plot} </p>
                </div>
            </div>
        </article>
        <article data-value="${awards}" class="notification is-primary">
            <p class="tile"> ${movieDetail.Awards} </p>
            <p class="subtitle"> Awards </p>
        </article>
        <article data-value="${dollar}" class="notification is-primary">
            <p class="tile"> ${movieDetail.BoxOffice} </p>
            <p class="subtitle"> Box Office </p>
        </article>
        <article data-value="${metascore}" class="notification is-primary">
            <p class="tile"> ${movieDetail.Metascore} </p>
            <p class="subtitle"> Metascore </p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="tile"> ${movieDetail.imdbRating} </p>
            <p class="subtitle"> IMDB Rating </p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="tile"> ${movieDetail.imdbVotes} </p>
            <p class="subtitle"> IMDB Votes </p>
        </article>
    `
}

const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster
		return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `
	},
	inputValue(movie) {
		return movie.Title
	},
	fetchData,
}
createAutoComplete({
	root: document.querySelector("#left-autocomplete"),
	...autoCompleteConfig,
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden")
		onMovieSelect(movie, document.querySelector("#left-summary"), "left")
	},
})

createAutoComplete({
	root: document.querySelector("#right-autocomplete"),
	...autoCompleteConfig,
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden")
		onMovieSelect(movie, document.querySelector("#right-summary"), "right")
	},
})
