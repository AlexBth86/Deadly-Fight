    $(document).ready(function() {

    var turn = 0;
    var personnagesArray = [];
    var combat = false;
    var chgtArme = false;
    var finDeCombat = false;

    let x = ""; // définition des abscisses
    let y = ""; // définitions des ordonnées

    let n = 0;
    let indexRow = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; // pour les abcisses

// GENERATION CHIFFRE ALEATOIRE
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

// MISE EN PLACE DES CASES NON JOUABLES (CLASS CSS UNAVAILABLE)

    function getGreyCase() {
        n++;
        let x = getRandomInt(10); // 0 <= x <= 9
        let y = getRandomInt(10); // 0 <= y <= 9

        // coordonates = ID case (ex : B4(string))
        let coordonates = indexRow[x] + y;

        // Pour jQuery - ID case (ex : #B4(string))
        let idCase = "#" + coordonates;

        // récup class sur les ID des cases générées aléatoirement
        let attributCaseAvailable = document.getElementById(coordonates).getAttribute("class");

        // Vérif si case déjà "unavailable" si non, fonction relancée.
        if (!attributCaseAvailable.includes("unavailable")) {
            $(idCase).toggleClass("unavailable");
        } else {
            getGreyCase();
        };
    };

    // Lancement de la fonction getGreyCase (15 cases "unavailable")
    for (var i = 0; i <= 14; i++) {
        getGreyCase();
    };

// OBJETS ARMES

    let arme1 = {
        nom: "lame de l'ombre",
        degats: 10,
        idArme: 1
    };

    let arme2 = {
        nom: "fusils à pompe de redneck",
        degats: 20,
        idArme: 2
    };

    let arme3 = {
        nom: "grenade",
        degats: 30,
        idArme: 3
    };

    let arme4 = {
        nom: "fusils sniper - Hawk Eye",
        degats: 40,
        idArme: 4
    };

// OBJET PERSONNAGE

    let Personnage = {

        init: function(nom, sante, arme, defense, x, y, classCss) {
            this.nom = nom;
            this.sante = sante;
            this.arme = arme;
            this.defense = defense;
            this.x = x;
            this.y = y;
            this.classCss = classCss;
        },

        decrire: function() {
            let etatPerso = "<strong>" + this.nom + "</strong> : </br>- Santé : <strong>" + this.sante+" pts</strong>";
            let armeEquip = " </br>- Arme : " + "<strong>"+ this.arme.nom + " " + "(" + this.arme.degats + " pts de dégâts)</strong>";
            return etatPerso + armeEquip;
        },

        modifyPersoCase: function(xPerso, yPerso, memeCase) {
            
            // définition ID personnage
            let tempPerso = personnagesArray[turn];
            
            // Récupération du min et du max des x et y lors d'un déplacement de personnage
            var minX = Math.min(xPerso, this.x);
            var maxX = Math.max(xPerso, this.x);
            var minY = Math.min(yPerso, this.y);
            var maxY = Math.max(yPerso, this.y);

            // Si ordonnées inchangées
            if (yPerso == this.y) {
                // vérification jusqu'a ce que l'abcsisse minimale soit égale à la maximale
                for (minX; minX <= maxX; minX++) {
                    // Si la case est différente de la case de départ
                    if (indexRow[minX] + this.y != indexRow[this.x] + this.y) {
                        // Et si cette case contient un attribut "data-idArme" => function changementArme
                        if ($("#" + indexRow[minX] + this.y).attr('data-idArme')) {
                            tempPerso.changementArme(indexRow[minX] + this.y, memeCase);
                            break;
                        }
                    }
                }
            };

            // Si abscisses inchangées
            if (xPerso == this.x) {
                for (minY; minY <= maxY; minY++) {
                    if (indexRow[this.x] + minY != indexRow[this.x] + this.y) {
                        if ($("#" + indexRow[this.x] + minY).attr('data-idArme')) {
                            tempPerso.changementArme(indexRow[this.x] + minY, memeCase);
                            break;
                        }
                    }
                }
            };

            this.x = xPerso; // définition de la nouvelle abscisse dans l'objet personnage
            this.y = yPerso; // définition de la nouvelle ordonnée dans l'objet personnage

            let coordonatesPerso = indexRow[xPerso] + yPerso;
            let idCasePerso = "#" + coordonatesPerso;
            let idCaseThumbnail = "#thumbnail" + coordonatesPerso;

            // Mise en place de la vignette du personnage sur la nouvelle case
            $(idCasePerso).toggleClass(this.classCss);
            // Si memeCase = false => toggle class arme de l'objet personnage grâce à son ID
            if (!memeCase) {
                $(idCaseThumbnail).toggleClass("thumbnail-arme" + this.arme.idArme);
            }
        },

        getPersoCase: function(autrePerso) {

            let xPerso = getRandomInt(10);
            let yPerso = getRandomInt(10);

            this.x = xPerso;
            this.y = yPerso;

            let coordonatesPerso = indexRow[xPerso] + yPerso;
            let idCasePerso = "#" + coordonatesPerso;
            let idCaseThumbnail = "#thumbnail" + coordonatesPerso;

            // Comparaison emplacement personnage (même case ou 1 case de diff)
            if ((this.x === autrePerso.x && this.y === autrePerso.y) || (this.x === autrePerso.x && this.y === autrePerso.y + 1) || (this.x === autrePerso.x && this.y === autrePerso.y - 1) || (this.y === autrePerso.y && this.x === autrePerso.x + 1) || (this.y === autrePerso.y && this.x === autrePerso.x - 1)) {
                // Placement personnage
                this.getPersoCase(autrePerso);
              // si case n'as pas de class "unavailable"  
            } else if (!($(idCasePerso).hasClass("unavailable"))) { 
                // affichage vignette personnage
                $(idCasePerso).toggleClass(this.classCss);
                // affichage vignette arme (thumbnail)
                $(idCaseThumbnail).toggleClass("thumbnail-arme" + this.arme.idArme);
            } else {
                // si aucune condition => relance de la fonction
                this.getPersoCase(autrePerso);
            };

        },

        affichageCasesJouables: function() {

            // vérification abscisses négative (vers la gauche) avant affichage de la class "surlignage"

            for (var i = 1; i < 4; i++) {
                let upCase = '#' + indexRow[this.x - i] + this.y;

                // Si l'une des cases est non jouable ou contient un personnage
                if ($(upCase).hasClass('unavailable') || $(upCase).hasClass('perso2') || $(upCase).hasClass('perso1')) {
                    // arrêt de l'affichage de la class "surlignage" 
                    break;
                } else {
                    // affichage de la class "surlignage"
                    $(upCase).toggleClass('surlignage');
                };
            };

            // Vérification abscisses positives (vers la droite) avant affichage de la class "surlignage"

            for (var i = 1; i < 4; i++) {
                let upCase = '#' + indexRow[this.x + i] + this.y;

                if ($(upCase).hasClass('unavailable') || $(upCase).hasClass('perso2') || $(upCase).hasClass('perso1')) {
                    break;
                } else {
                    $(upCase).toggleClass('surlignage');
                };
            };

            // Vérification ordonnées négative (vers le bas) avant affichage de la class "surlignage"

            for (var i = 1; i < 4; i++) {
                let upCase = '#' + indexRow[this.x] + (this.y - i);

                if ($(upCase).hasClass('unavailable') || $(upCase).hasClass('perso2') || $(upCase).hasClass('perso1')) {
                    break;
                } else {
                    $(upCase).toggleClass('surlignage');
                };
            };

            // Vérification ordonnées positives (vers le haut) avant affichage de la class "surlignage"

            for (var i = 1; i < 4; i++) {
                let upCase = '#' + indexRow[this.x] + (this.y + i);

                if ($(upCase).hasClass('unavailable') || $(upCase).hasClass('perso2') || $(upCase).hasClass('perso1')) {
                    break;
                } else {
                    $(upCase).toggleClass('surlignage');
                };
            };
        },

        changementArme: function(idCase, memeCase) {
            // ***** /!\ *****
            // lors d'un déplacement 'par-dessus' l'arme => switch arme via methode "affichageCasesJouables" (délenchement via fonction endTurn)
            // lors d'un déplacement 'sur la case' de l'arme => le switch arme via methode "modifyPersoCase" (délenchement via fonction bindSurlignage) 
            // ***** /!\ *****

            chgtArme = true;

            // Récupération ID arme
            var tempArme = $('#' + idCase).attr('data-idArme');
            // suppression class arme présente sur la case (image) et remplacement par class arme présente sur le perso (image)
            // + implémentation de l'ID de l'arme présente sur le perso sur la case via la fonction data
            $('#' + idCase).removeClass("arme" + tempArme).addClass('arme' + this.arme.idArme).attr('data-idarme', this.arme.idArme);

            // Si déplacement directement sur la case de l'arme et non passage par au-dessus 
            if (memeCase) {
                // suppression de la thumbnail présente sur le perso et ajout de la thumbnail de l'arme présente sur la case
                $('#thumbnail' + idCase).removeClass('thumbnail-arme' + this.arme.idArme).addClass('thumbnail-arme' + tempArme);
            }

            // Définition de la nouvelle arme dans objet personnage via l'ID de l'arme
            switch (parseInt(tempArme)) {
                case 1:
                    this.arme = arme1;
                    break;
                case 2:
                    this.arme = arme2;
                    break;
                case 3:
                    this.arme = arme3;
                    break;
                case 4:
                    this.arme = arme4;
                    break;
                default:
                    this.arme = arme1;
                    break;
            }

            // Affichage commentaires de jeu (section)
            document.getElementById("commentaires-jeu").innerHTML = "";
            document.getElementById("commentaires-jeu").innerHTML += "Le " + this.nom + " est maintenant équipé de l'arme <strong>" + this.arme.nom + "</strong> " + "(" + this.arme.degats + " pts de dégâts)</br></br>";

        },

        attaque: function(adversaire) {
            
            // Si santé
            if (this.sante > 0) {
                
                // indice de défense à 1
                this.defense = 1;
                
                // calcul des dégats pondéré par l'indice de défense
                let degatsVsDefense = (this.arme.degats * adversaire.defense);
                adversaire.sante = adversaire.sante - degatsVsDefense;
                
                // affichage commentaires de jeu (section)
                document.getElementById("commentaires-jeu").innerHTML = "";
                document.getElementById("commentaires-jeu").innerHTML += "Le <strong>"+this.nom + "</strong> fait <strong>" + degatsVsDefense + " pts</strong> de dégats au " + adversaire.nom+"</br></br>";

                // Si adversaire vivant
                if (adversaire.sante > 0) {
                    // commentaire sur vie restante à l'adversaire
                    document.getElementById("commentaires-jeu").innerHTML += "Le <strong>"+adversaire.nom+"</strong> a " +"<strong>"+adversaire.sante + " pts</strong> de vie</br></br>";
                    // si adversaire mort
                } else if (adversaire.sante <= 0){
                    // affichage text de fin de combat dans section commentaire de jeu et masquage des boutons
                    finDeCombat = true;
                    $('h2').text("");
                    document.getElementById("commentaires-jeu").innerHTML = "";
                    document.getElementById("commentaires-jeu").innerHTML += "FIN DU COMBAT !"+"</br></br><strong>"+this.nom+ "</strong> a gagné";
                    $('.button-attack').hide();
                    $('.button-defense').hide();
                }
            }
        },

        defenseCombat: function() {
            // Si santé
            if (this.sante > 0) {
                // définition de l'indice à 0,5 (50% de bonus)
                this.defense = 0.5;
                document.getElementById("commentaires-jeu").innerHTML = "";
                document.getElementById("commentaires-jeu").innerHTML += "<strong>"+this.nom +"</strong> a augmenté sa défense de 50 % pour le prochain tour.</br></br>";
            } else if (this.sante <= 0) {
                document.getElementById("commentaires-jeu").innerHTML = "";
                document.getElementById("commentaires-jeu").innerHTML += "<strong>"+this.nom +"</strong> ne peut pas jouer puisqu'il est mort";
            }
        },
    };

// CREATION DES PERSONNAGES

    let perso1 = Object.create(Personnage);
    perso1.init("Joueur 1", 100, arme1, 1, 0, 0, "perso1");
    let perso2 = Object.create(Personnage);
    perso2.init("Joueur 2", 100, arme1, 1, 0, 0, "perso2");

    // push des personnage dans tableau "personnagesArray" pour gérer le tour par tour via l'index
    personnagesArray.push(perso1);
    personnagesArray.push(perso2);

// COMMANDES DE PLACEMENT DES PERSONNAGES

    perso1.getPersoCase(perso2);
    perso2.getPersoCase(perso1);
    perso1.affichageCasesJouables()

// FONCTION DE PLACEMENT DES ARMES

    function getWeaponCase() {
        let xArme = getRandomInt(10);
        let yArme = getRandomInt(10);

        let coordonatesArme = indexRow[xArme] + yArme;
        let idCaseArme = "#" + coordonatesArme;

        // Si case ne contient pas l'attribut "unavailable", "perso1 ou 2", "arme2-3 ou 4"
        if (!$(idCaseArme).hasClass("unavailable") && !$(idCaseArme).hasClass("perso1") && !$(idCaseArme).hasClass("perso2") && !$(idCaseArme).hasClass("arme2") && !$(idCaseArme).hasClass("arme3") && !$(idCaseArme).hasClass("arme4")) {
            // mise en place de l'arme (class + id)
            $(idCaseArme).toggleClass("arme" + i).attr('data-idarme', i);
        } else {
            // relance de la fonction
            getWeaponCase();
        };
    };

    // pour 3 armes (arme 2/3/4)
    for (var i = 2; i <= 4; i++) {
        getWeaponCase();
    };

// FONCTION DE DEPLACEMENT
        
    // lancement fonction qui gère le bind sur la class "surlignage" et le tour par tour (pour supprimer l'ancien "surlignage")
    bindSurlignage();

// END TURN

    function endTurn() {
        turn++;

        // Si turn est sup. à personnagesArray (soit 2 joueurs)
        if (turn >= personnagesArray.length) {
            // remise à zéro
            turn = 0;
        }

        // Affichage commentaires de jeu si pas de combat mais changement d'arme
        if (!combat && chgtArme) {
            var persoSuivant = personnagesArray[turn];
            // Affichage des cases jouable pour le personnage suivant
            persoSuivant.affichageCasesJouables();
            $('h2').text(persoSuivant.nom);
            document.getElementById("commentaires-jeu").innerHTML += "déplacez-vous pour <strong>récupérer une nouvelle arme</strong> ou placez-vous à côté de votre adversaire pour <strong>déclencher un combat à mort !</strong>";
            chgtArme = false;
            // Affichage commentaires de jeu si pas de combat
        } else if (!combat) {
            var persoSuivant = personnagesArray[turn];
            // Affichage des cases jouable pour le personnage suivant
            persoSuivant.affichageCasesJouables();
            $('h2').text(persoSuivant.nom);
            document.getElementById("commentaires-jeu").innerHTML = "";
            document.getElementById("commentaires-jeu").innerHTML += "déplacez-vous pour <strong>récupérer une nouvelle arme</strong> ou placez-vous à côté de votre adversaire pour <strong>déclencher un combat à mort !</strong>";
            // Affichage commentaires de jeu si combat déclenché (voir bindSurlignage)
        } else if (combat) {
            // Vide => Afficahge passé directement via la fonction "combat"
        };
    }

// BIND SURLIGNAGE

    function bindSurlignage() {
        // bind sur toutes div contenues dans les master-row (pour réinitilisation de la class surlignage avec .off().on())
        $('.master-row > div').off().on('click', function() {

            // Si il y a un surlignage
            if ($(this).hasClass('surlignage')) {
                // récupération du personnage temporaire
                let tempPerso = personnagesArray[turn];
                // récupération emplacement de départ
                let idCasePrecedente = indexRow[tempPerso.x] + tempPerso.y;
                // récupération de l'arme précédente
                var idCaseArmePrecedente = $('#' + idCasePrecedente).attr('data-idArme');
                
                // suppression de la class "surlignage"
                $('.surlignage').removeClass('surlignage');
                // suppression de la thumbnail du perso sur la case de départ (thumbnail arme)
                $('div.' + tempPerso.classCss + ' span').removeClass('thumbnail-arme' + tempPerso.arme.idArme);
                // suppression de la class perso sur la case de départ (vignette personnage)
                $('div.' + tempPerso.classCss).removeClass(tempPerso.classCss);

                // Récupération de l'ID de la case cliquée
                let str = $(this).attr('id');
                strY = Number(str.slice(1)); // string ordonnées
                strX = indexRow.indexOf(str.slice(0, 1)); // string abcisses

                // Si la case cliquée possède une class "arme" alors modifyPersoCase avec memeCase=true
                if ($(this).hasClass('arme1') || $(this).hasClass('arme2') || $(this).hasClass('arme3') || $(this).hasClass('arme4')) {
                    tempPerso.modifyPersoCase(strX, strY, true);
                    // Si la case cliquée ne possède pas de class "arme" alors modifyPersoCase avec memeCase=false
                } else {
                    tempPerso.modifyPersoCase(strX, strY, false);
                }

                // Récupération des nouvelles coordonnées du personnage 
                let monX = tempPerso.x;
                let monY = tempPerso.y;

                // Déclaration de la variable nextTurn pour récupérer les informations de l'objet suivant (adversaire)
                let nextTurn = turn + 1;
                if (nextTurn >= personnagesArray.length) {
                    nextTurn = 0;
                }

                let adversaire = personnagesArray[nextTurn];

                // Si les personnages sont placés sur des cases adjacentes (+/-1 en abcisses et en ordonnées)
                if ((monX + 1 == adversaire.x && monY == adversaire.y) || (monX - 1 == adversaire.x && monY == adversaire.y) ||  (monX == adversaire.x && monY - 1 == adversaire.y) ||  (monX == adversaire.x && monY + 1 == adversaire.y)) {
                    // Combat = true donc affichage vide des commentaires de jeu (voir endTurn)
                    combat = true;
                    // Déclenchement du combat
                    combats();
                    // Affichage des boutons Attaque/Défense
                    $('.button-attack').show();
                    $('.button-defense').show();
                }

                endTurn();
            }
        });
    }

// COMBATS

    function combats() {

        // Fonction gestion tour / tour (fonctionnement identique à endTurn et déclaration adversaire comme bindSurlignage
        function endTurnCombat() {
            turn++;

            if (turn >= personnagesArray.length) {
                turn = 0;
            }
            
            tempPerso = personnagesArray[turn];
            nextTurn = turn + 1;
            if (nextTurn >= personnagesArray.length) {
                nextTurn = 0;
            };
            
            adversaire = personnagesArray[nextTurn];
        }

        // récupération des valeurs de 'tempPerso' et de 'adversaire'
        let tempPerso = personnagesArray[turn];
        let nextTurn = turn + 1;
        if (nextTurn >= personnagesArray.length) {
            nextTurn = 0;
        };

        let adversaire = personnagesArray[nextTurn];

        // Affichage lancement de combat
        $('h2').text(tempPerso.nom);
        document.getElementById("commentaires-jeu").innerHTML = "";
        document.getElementById("commentaires-jeu").innerHTML += "<strong>Un combat à mort commence.</strong></br> Choissisez d'attaquer ou de défendre !</br></br>";
        document.getElementById("commentaires-jeu").innerHTML += tempPerso.decrire()+"</br></br>";
        document.getElementById("commentaires-jeu").innerHTML += adversaire.decrire()+"</br></br>";
        document.getElementById("commentaires-jeu").innerHTML += "<strong>"+tempPerso.nom+"</strong>"+" a vous de jouer.";   


        // Au clic sur bouton "Attaquer"
        $('.button-attack').on('click', function() {
                document.getElementById("commentaires-jeu").innerHTML = "";
                endTurnCombat();
                // Appel methode "attaque" dans objet personnage
                tempPerso.attaque(adversaire);
            
            // Si le combat n'est pas fini => Affichage dans commentaires de jeu
            if (!finDeCombat) {
                $('h2').text(adversaire.nom);
                document.getElementById("commentaires-jeu").innerHTML += tempPerso.decrire()+"</br></br>";
                document.getElementById("commentaires-jeu").innerHTML += adversaire.decrire()+"</br></br>";
                document.getElementById("commentaires-jeu").innerHTML += "<strong>"+adversaire.nom+"</strong>"+" a vous de jouer.";   
            }  
        });

        // Au clic sur bouton "Défendre"
        $('.button-defense').on('click', function() {
            endTurnCombat();
            // Appel methode "defenseCombat" dans objet personnage
            tempPerso.defenseCombat();
            
            // Affichage dans commentaires de jeu
            $('h2').text(adversaire.nom);
            document.getElementById("commentaires-jeu").innerHTML += tempPerso.decrire()+"</br></br>";
            document.getElementById("commentaires-jeu").innerHTML += adversaire.decrire()+"</br></br>";
            document.getElementById("commentaires-jeu").innerHTML += "<strong>"+adversaire.nom+"</strong>"+" a vous de jouer.";
        });
    }

// AFFICHAGE COMMENTAIRES DE JEU (SEULEMENT AU LANCEMENT)
    document.getElementById("commentaires-jeu").innerHTML = "";
    document.getElementById("commentaires-jeu").innerHTML += "déplacez-vous pour <strong>récupérer une nouvelle arme</strong> ou placez-vous à côté de votre adversaire pour <strong>déclencher un combat à mort !</strong>";

});