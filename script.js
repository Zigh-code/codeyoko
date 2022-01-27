var display    = document.getElementById("rect");
var data_case  = rect.getContext("2d");

var form       = document.getElementsByTagName('form')[0];
var case_color = '#28003B';
var version    = 1;
var type_code  = 1;

display.width  = 180;
display.height = 180;


form.addEventListener("submit", encodage,false);


/*
    Cette fonction verifie si on a bien rentree quelque chose avant de code notre entree
    Si on tente de valider sans entree quelque chose, elle ne fait rien
*/
function encodage(e){
    var entree = document.getElementById('entree');
    if (entree.value != "") {
       showCode(start(coordonne(diag(encodage_ANSII(entree.value)),2))); 
    }
    
    e.preventDefault();
}

/*
    Cette fonction transforme les donnees texte en en binaire (normes ansii),
    et ajoute aussi la ligne d'info de notre code
*/

function encodage_ANSII(texte){
    var ansii = "";
     
    //On ajoute la ligne d'info avant l'encodage binaire du message
    ansii = info(texte,version,type_code);

    texte_codage = texte;
    let k=0;

    //Si le mots est inferieur a la taille max de notre code graphique,
    //Alors on repete le mots ..(ses caracteres)
    while (texte_codage.length<=27) {
        texte_codage += texte_codage.charAt(k);
        k++;
        k = k % texte.length;
    }
    
    //Ensuite transforme le tout en code binaire
    for (i = 0; i < texte_codage.length; i++) {
        var ansii_dec = texte_codage.charCodeAt(i);
        var bin = toBinX(ansii_dec,8);
        ansii += bin;
    }  
    return ansii;
}

/*Cette fonction transforme du decimal au binaire.. sur un plage de bit */
function toBinX(e,t){
    var bin = e.toString(2);
    var binX = "";
    if (bin.length<t) {
        for (let index = 0; index < (t - bin.length); index++) {
            binX += '0';
        }
    }
    binX +=bin;
    return binX;
}

/* 
    Cette fonction transforme un code binaire en coordonne x,y pour notre matrice
    Il ne revoie que les positions des bits 1;
    Il prend en parametre le code binaire a transforme,
    et l le nombre d'octet qu'on veut coder par ligne
*/
function coordonne(code_bin,l){
    var coord = [];
    var caractere,s;
    var x,y;
    for (i = 0; i < code_bin.length; i++) {
            caractere = code_bin.charAt(i);
            if (caractere=='1') {
                x = parseInt(i/(8 * l)) + 1;
                y = i % (8 * l) +1;
                s = y +','+ x;
                coord.push(s); 
            }
    }
    return coord;
}

/*
    Cette fonction ajoute la ligne diagonal d'alignement 
    Cette ligne permet de detecter visuellement la presence de certaines d'erreur
    ou d'un mauvais alignement de code ... probleme d'impression,support plie par exemple
    Cette ligne de diagonal est un succession de 10
*/
function diag(x){
    let index = 0;
    while (index <= x.length) {
        if (index%2 == 0) {
            x = x.substring(0, index) + '1' + x.substring(index, x.length);
        } else {
            x = x.substring(0, index) + '0' + x.substring(index, x.length);
        }
        index+=17;     
    }
    return x;

}

/*
    Cette fonction creer les zones de reperes de notre code 
    Ou commence a lire notre code , la detecter 

*/
function start(code){
    code.push('0,0','1,0','2,0','17,0','0,1','0,2','0,17');
    return code;
}


/*
    Cette fonction permet de creer la ligne d'info de notre code
    la ligne d info contient la version de notre code, 
    la taille de la matrice <15 pour cette version (la matrice etant toujours carree donc la longuer suffit)
    la taille du mots a coder,
    et le type de message a coder.. dans une futur version on peut decide de coder chaque type de message
    de facon plus specifique 
    (exemple les chiffres.. on n'utilise pas l'ansii, les liens on peut par exemple supprimer le http lors de l'encodage..
    ou eviter de le coder sur tout l'ansii puisque les liens ne contiennents par certaine caracteres exemple espace.. les majuscules etc..)

*/
function info(mots,v,type){
    let taille = mots.length;
    let matrice = 8;
    var info = toBinX(v,3)+toBinX(matrice,4)+toBinX(taille,6)+toBinX(type,2);
    return info;
}


/*
    Cette fonction s'occupe de l'affichage de notre code
*/
function showCode(table) {
    pos = table;
    data_case.clearRect(0,0,screen.width,screen.height);
    for (i = 0; i < table.length; i++) {
        pos[i] = pos[i].split(',')
        setCase(pos[i][0], pos[i][1]);
    }

}

/*
    cette fonction creer une case ;
    c'est l unite de base de notre code, representant le 1 dans notre code 
*/
function setCase(x, y) {
    data_case.fillStyle = case_color;
    data_case.fillRect(x * 10, y * 10, 10, 10);
}

