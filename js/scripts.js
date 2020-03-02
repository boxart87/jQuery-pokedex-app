var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemonModalContainer = $('#pokemon-modal-container');
    var $pokemonList = $('ul');
    //adds pokemopn info to my repository array
    function add(pokemon) {
        repository.push(pokemon);
    }
    //allows access to my repositiory array
    function getAll() {
        return repository;
    }
    //adds a clickable list of all pokemon
    function addListItem(pokemon) {
        var listItem = $('<li></li>').addClass('list-group-item');
        var button = $('<button type="button" data-toggle="modal" data-target="#modal"></button>').addClass('pokemon-button btn btn-lg btn-block').text(pokemon.name);
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
    //loads data from external api
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
    //loads data detail so it can be used in my app
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
                item.types = [details.types[1].type.name.charAt(0).toUpperCase() + details.types[1].type.name.slice(1)] + ' / ' + [details.types[0].type.name.charAt(0).toUpperCase() + details.types[0].type.name.slice(1)];
            } else {
                item.types = [details.types[0].type.name.charAt(0).toUpperCase() + details.types[0].type.name.slice(1)];
            }

        }).catch(function (e) {
            console.error(e);
        });
    }

    //function to load all neccessary data into the modal
    function showModal(item) {

        //clear existing modal content
        $pokemonModalContainer.empty();

        //start bootstrap modal code
        //var $modal = $('<div tabindex="-1" id="modal" role="dialog" aria-hidden="true"></div>').addClass('modal fade');
        var $modalDialog = $('<div role="document"></div>').addClass('modal-dialog');
        var $modalContent = $('<div></div>').addClass('modal-content');

        //modal header
        var $modalHeader = $('<div></div>').addClass('modal-header');
        var $modalTitle = $('<h2></h2>').addClass('modal-title').text(item.name);
        var $modalClose = $('<button type="button" data-dismiss="modal" aria-label="Close"></button>').addClass('close').text('close').on('click', hideModal);

        //modal body
        var $modalBody = $('<div></div>').addClass('modal-body');
        var $modalImage = $('<img src=' + item.imageUrl + '>').addClass('pokemon-img');

        //adds a wrapper to pokemon info so i can organize it into a grid
        var pokemonGrid = $('<div></div>').addClass('container');

        //adds row for pokemon type
        var pokemonGridTypeRow = $('<div></div').addClass('row');

        //adds grid item for pokemon type
        var pokemonType = $('<h3></h3>').addClass('col').text('Type(s)');
        var pokemonTypeInfo = $('<p></p>').addClass('col').text(item.types);

        //adds row for pokemon height
        var pokemonGridHeightRow = $('<div></div').addClass('row');

        //adds grid item for pokemon height
        var pokemonHeight = $('<h3></h3>').addClass('col').text('Height');
        var pokemonHeightInfo = $('<p></p>').addClass('col').text(item.height + 'm');

        //adds row for pokemon weight
        var pokemonGridWeightRow = $('<div></div').addClass('row');

        //adds grid item for pokemon weight
        var pokemonWeight = $('<h3></h3>').addClass('col').text('Weight');
        var pokemonWeightInfo = $('<p></p>').addClass('col').text(item.weight + 'kg');

        //appends modal header
        $modalHeader.append($modalTitle);
        $modalHeader.append($modalClose);
        $modalContent.append($modalHeader);

        //appends grid items
        pokemonGridTypeRow.append(pokemonType);
        pokemonGridTypeRow.append(pokemonTypeInfo);
        pokemonGridHeightRow.append(pokemonHeight);
        pokemonGridHeightRow.append(pokemonHeightInfo);
        pokemonGridWeightRow.append(pokemonWeight);
        pokemonGridWeightRow.append(pokemonWeightInfo);

        //appends pokemon grid rows
        pokemonGrid.append(pokemonGridTypeRow);
        pokemonGrid.append(pokemonGridHeightRow);
        pokemonGrid.append(pokemonGridWeightRow);

        //appends modal body
        $modalBody.append($modalImage);
        $modalBody.append(pokemonGrid);

        //append modal content
        $modalContent.append($modalBody);

        //append modal dialog
        $modalDialog.append($modalContent);

        //append modal container
        $pokemonModalContainer.append($modalDialog);

        //make the modal container visible
        $pokemonModalContainer.addClass('is-visible');

        //hide details only when clicking either outside modal or close button
        function hideModal() {
            $pokemonModalContainer.removeClass('is-visible');
        }
        //hide modal when pressing ecape key
        $(window).on('keydown', (e) => {
            if (e.key === 'Escape' && $pokemonModalContainer.hasClass('is-visible')) {
                hideModal();
            }
        });
        //hide modal when clicked outside of modal
        $pokemonModalContainer.on('click', (e) => {
            var target = $(e.target);
            if (target.is($pokemonModalContainer)) {
                hideModal();
            }
        });

        //return all functions so they can be used outside of iife
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

    }) ();


    pokemonRepository.loadList().then(function () {
        // Now the data is loaded!
        pokemonRepository.getAll().forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    });