document.addEventListener("DOMContentLoaded", () => {
    // create variables for the parts that you want to access in the HTML
    const filmDetailsContainer = document.getElementById('filmDetails');
    const filmsList = document.getElementById('films');

    // fetch all movies
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const films = data.films;

            // create a for each that will get each object
            films.forEach(movie => {
                const filmItem = document.createElement("li");
                filmItem.classList.add('film-item');
                filmItem.innerText = movie.title;

                // fetch individual movie items when clicked 
                filmItem.addEventListener("click", () => {
                    // Display movie details using the already fetched movie object
                    displayMovieDetails(movie);
                });

                filmsList.appendChild(filmItem);
            });

            // Display details of the first movie by default
            if (films.length > 0) {
                // Display movie details using the first movie object
                displayMovieDetails(films[0]);
            }

            function displayMovieDetails(movie) {
                const isSoldOut = movie.capacity - movie.tickets_sold <= 0;

                filmDetailsContainer.innerHTML = `
                    <h2>${movie.title}</h2>
                    <img src="${movie.poster}" alt="${movie.title} Poster">
                    <h3>Description: ${movie.description}</h3>
                    <p>Runtime: ${movie.runtime} minutes</p>
                    <p>Showtime: ${movie.showtime}</p>
                    <p>Available Tickets: <span id="availableTickets">${movie.capacity - movie.tickets_sold}</span></p>
                    <button id="buyTicket">${isSoldOut ? 'Sold Out' : 'Buy Ticket'}</button>
                `;
        
                // Add event listener for the "Buy Ticket" button
                const buyTicketButton = document.getElementById('buyTicket');
                if (!isSoldOut) {
                    buyTicketButton.addEventListener('click', () => buyTicket(movie));
                }
            }
        
            function buyTicket(movie) {
                const availableTicketsElement = document.getElementById('availableTickets');
                const currentAvailableTickets = parseInt(availableTicketsElement.innerText);
        
                if (currentAvailableTickets > 0) {
                    // Reduce available tickets by 1
                    availableTicketsElement.innerText = currentAvailableTickets - 1;
        
                    // Update movie tickets_sold
                    movie.tickets_sold += 1;

                    // Check if the movie is now sold out
                    const isSoldOut = movie.capacity - movie.tickets_sold <= 0;

                    // Update button text if sold out
                    if (isSoldOut) {
                        const buyTicketButton = document.getElementById('buyTicket');
                        buyTicketButton.innerText = 'Sold Out';
                    
                    }
                } else {
                    alert('Sold out! No more tickets available.');
                }
            }
        });
});