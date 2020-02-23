var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemonModalContainer = $('#pokemon-modal-container');
    var $pokemonList = $('ul');

    function add(pokemon) {
        repository.push(pokemon);
    }

    function getAll() {
        return repository;
    }

    function addListItem(pokemon) {
        var listItem = $('<li></li>');
        var button = $('<button></button>').addClass('pokemon-button').text(pokemon.name);
        listItem.append(button);
        $pokemonList.append(listItem);
        button.on('click', function () {
            showDetails(pokemon)
        });
    }

    //show detais of clicked pokemon
    function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function () {
            showModal(pokemon);
        });
    }
    //double check this!
    function loadList() {
        return $.ajax(apiUrl, { dataType: 'json' }).then(function (json) {
            $.each(json.results, function (i, item) {
                var pokemon = {
                    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url, { dataType: 'json' }).then(function (details) {
            // Now we add the details to the item
            item.name = item.name;
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            //item.types = details.types.forEach.type.name;
            if (details.types.length === 2) {
                item.types = [details.types[1].type.name] + ' / ' + [details.types[0].type.name];
            } else {
                item.types = [details.types[0].type.name];
            }

        }).catch(function (e) {
            console.error(e);
        });
    }

    function showModal(item) {

        //clear existing modal content
        $pokemonModalContainer.innerHTML = '';

        var pokemonModal = $('<div></div>').addClass('pokemon-modal');

        //this adds new content for the modal

        //adds close button
        var pokemonCloseButtonElement = $('<button></button>').addClass('pokemon-modal-close').text('Close');
        pokemonCloseButtonElement.on('click', hideModal);

        //adds a header displaying the pokemon name
        var pokemonName = $('<h2></h2>').text(item.name);

        //adds an image of the pokemon
        var pokemonImage = $('<img src=' + item.imageUrl + '>').addClass('pokemon-img');


        //adds a wrapper to pokemon info so i can organize it into a grid
        var pokemonGrid = $('<div></div>').addClass('pokemon-grid');

        //adds grid item h2 for pokemon type
        var pokemonType = $('<h3></h3>').addClass('pokemon-grid_item').text('Type(s)');

        //adds grid item p for pokemon type info
        var pokemonTypeInfo = $('<p></p>').addClass('pokemon-grid_item').text(item.types);

        //adds grid item h2 for pokemon height
        var pokemonHeight = $('<h3></h3>').addClass('pokemon-grid_item').text('Height');

        //adds grid item p for pokemon height info
        var pokemonHeightInfo = $('<p></p>').addClass('pokemon-grid_item').text(item.height + 'm');

        //adds grid item h2 for pokemon weight
        var pokemonWeight = $('<h3></h3>').addClass('pokemon-grid_item').text('Weight');

        //adds grid item p for pokemon weight info
        var pokemonWeightInfo = $('<p></p>').addClass('pokemon-grid_item').text(item.weight + 'kg');

        //appends grid items
        pokemonGrid.append(pokemonType);
        pokemonGrid.append(pokemonTypeInfo);
        pokemonGrid.append(pokemonHeight);
        pokemonGrid.append(pokemonHeightInfo);
        pokemonGrid.append(pokemonWeight);
        pokemonGrid.append(pokemonWeightInfo);

        //appends modal
        pokemonModal.append(pokemonCloseButtonElement);
        pokemonModal.append(pokemonName);
        pokemonModal.append(pokemonImage);
        pokemonModal.append(pokemonGrid);

        //appends modal container
        $pokemonModalContainer.append(pokemonModal);

        $pokemonModalContainer.addClass('is-visible');
    }

    //hide details only when clicking either outside modal or close button
    function hideModal() {
        $pokemonModalContainer.removeClass('is-visible');
    }

    $(window).on('keydown', (e) => {
        if (e.key === 'Escape' && $pokemonModalContainer.hasClass('is-visible')) {
            hideModal();
        }
    });

    $pokemonModalContainer.on('click', (e) => {
        var target = e.target;
        if (target === $pokemonModalContainer) {
            hideModal();
        }
    })

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal
    };

})();


pokemonRepository.loadList().then(function () {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});