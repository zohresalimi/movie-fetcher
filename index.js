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

const onMovieSelect = async (movie, summaryElement) => {
	const response = await axios.get("http://www.omdbapi.com/", {
		params: {
			apikey: "20e5b8ea",
			i: movie.imdbID,
		},
	})
	summaryElement.innerHTML = movieTemplate(response.data)
	console.log(response.data)
}

const movieTemplate = (movieDetail) => {
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
        <article class="notification is-primary">
            <p class="tile"> ${movieDetail.Awards} </p>
            <p class="subtitle"> Awards </p>
        </article>
        <article class="notification is-primary">
            <p class="tile"> ${movieDetail.BoxOffice} </p>
            <p class="subtitle"> Box Office </p>
        </article>
        <article class="notification is-primary">
            <p class="tile"> ${movieDetail.Metascore} </p>
            <p class="subtitle"> Metascore </p>
        </article>
        <article class="notification is-primary">
            <p class="tile"> ${movieDetail.imdbRating} </p>
            <p class="subtitle"> IMDB Rating </p>
        </article>
        <article class="notification is-primary">
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
		onMovieSelect(movie, document.querySelector("#left-summary"))
	},
})

createAutoComplete({
	root: document.querySelector("#right-autocomplete"),
	...autoCompleteConfig,
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden")
		onMovieSelect(movie, document.querySelector("#right-summary"))
	},
})
