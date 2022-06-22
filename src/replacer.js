/* 
 * iocReplacer és l'objecte que disposa d'utilitats d'insersió i substritució d'informació per pàgines
 * WEB a partir d'un firtxer json.
 * EL fitxar json permet definir mùltiples comanes de remmplaçament associades a un identificador. 
 * Cada identificador representa les comandes de reemplaçament d'un pàgina WEB concreta.  És a dir,
 * un mateix fitxer jsos pot configurar múltiples pàgines. Cal tenir en compte erò que l'identificador no és 
 * el nom de la pàgina sinó un codi. Desvinculant així el nom de la pàgina i l'identificador podrem, reusar les 
 * mateixes comandes per diverses pagines o fer servr dos o més identificadors en una mateixa pàgina.
 * El fitxer json pot disposar d'un identificador especial anomenat defaultValues. Cada una de les comandes 
 * de reemplaçament associades a un identificador, es troben també identificades per valors clau (keys). La sintàxi 
 * d'una comanda de reemplaçament és:
 *   - selector: indica el selector usat per localitzar el lloc on cal fer el reemplaçament. Per exemple: "#aaa1" o 
 *              bé ".classeX" o qualsevol altre selecctor CSS vàlid. Pot ser opcional si només es fa servir com a valor 
 *              de referència d'altres comande de reemplaçament.
 *   - type: indica el tipus de remplaçament. Pot prendre els següent valors: text, html, atrr, arrayText, ref, file/txt i file/html. 
 *              EL valor text reemplacaçar+a a totes les etiquetes HTML de la pàgina o fer la substitució, seleccionades amb el selector, amb el text contingut al paràmetre 'value'.
 *              EL valor html reemplacaçar+a a totes les etiquetes HTML de la pàgina o fer la substitució, seleccionades amb el selector, el seu contingut amb el valor html dal paràmetre 'value'.
 *              El valor attr, reemplaçarà l'atribut anomenat com el valor de la propietat 'name' amb el valor de la propietat 'value'
 *              EL valor arrayText permet concatenar un conjunt de valors de tipus arrayjson ([..., ...]). fent servir un caracter o conjunt de caràctes separadors. 
 *              EL valor ref, permet fer referpencia a una comanda de reemplaçament definida enb una altre lloc (diferent identificador), però en el mateix fitxer json, EL paràmetre 'name' indicarà 
 *              el nom de l'identificador on es troba la instrucció de reemplaçament i la propietat 'value' serà la key usada per extreure la comanda específica.
 *              El valor file/text i file/html tene la mateixa funció que text o html, però amb la diferenci que el valor, en compte de ser el contingut de reemplaçament, és una URL apuntant a un fitxer extern 
 *              de text on es trova el text o htm a substituir.
 *              La propietat tye és opcional perquè en el seu lloc podem fer servir la propietat defaultValues, el valor de la qual indica la key de l'identificador defaultValues que caldrà 
 *              fer servir per obtenir la instrucció de reeemplaçament.
 *   - value: segons el type indica una o altre cosa, però en general indica el valor que caldrà reemplaçar
 *   - name: segons el type indica diferents coses. Per exemple si el type és attr, name indica el nom de l'atribut, però si es ref, name inidcarà el valor de l'identificador on trobarem la 
 *              instrucció de reemplaçament.
 *   - separator. Només cal posar-lo si el type és un arraText i indica 
 * 
 * L'objecte iocReplacer pot configurar-se usant la funció iocReplacer::init. A través d'aquesta funció se li 
 * indica quina és la URL on es troba el fitxers json amb les indicacions de reemplaçament, quin és l'identificador que es farà sevir per fer la substitució a la pàgina. 
 * Cada pàgina hauria de tenir un identificador diferent, per tal de gestionar la substitució de només les dades específiques. La funció init també rep un boolean per indicar si 
 * la càrrega del json s'ha de fer fer de forma asincrona o no (síncrona) i un darrer paràmetre per assignar el tractament d'error en cas que la càrrega del json falli.
 * 
 * Per a la substitució, l'objete iocReplacer dispos de la funció iocReplacer::toReplaceOnLoad, el qual inicia el procés de susbtitució amb els paràmetres inicialitzats a través de la
 * funció iocRecplacer::init. Tanmateix, la funció iocReplacer::toReplaceOnLoad, opcionalment, admet també els mateixos paràmetres que els usats en la inicialització. Així admed les següents formes:
 *   - toReplaceOnLoad(). Sense paràmetres amb les dades inicialitzades per defecte.
 *   - toReplaceOnLoad(onError). Indicant la funció de control d'error en cas que no s'aconsegueixi carregar el json. El paràmetre ha de ser una funció 
 *   - toReplaceOnLoad(url). Indicant la URL del json d'on extreure les dades. El paràmetre ha de ser un string
 *   - toReplaceOnLoad(url, id). Indicant la URL del json d'on extreure les dades i l'identificador per les dades de la pàgina. 
 *   - toReplaceOnLoad(url, id, onError) Indicant la URL del json d'on extreure les dades i l'identificador per les dades de la pàgina i la funció de control d'error en cas que no 
 *                                       s'aconsegueixi carregar el json.
 *   - toReplaceOnLoad(url, id, async, onError)  Indicant la URL del json d'on extreure les dades i l'identificador per les dades de la pàgina, com ha de ser la càrrefa del json (asincrona (true) 
 *                                       o síncrona (false) i la funció de control d'error en cas que no s'aconsegueixi carregar el json.                                      s'aconsegueixi carregar el json.
 * 
 * La funció createReplacerFromTagConfig, permet la inicialització automàtica a partir d'una etiqueta HTM anomenada replacer-config, la qual contindrà els següents atributs:
 * data-url: indica la URL on es troba el json amb les dades a substituir. Exemple: "https://ioc.xtec.cat/materials/FP/json_pt_data/replacedata/documents_fp_plans_de_treball_pt_asx_m03b2.json"
 * data-id: indica la clau que contindrà les dades de substitució per aquesta pàgina. Per exemple, "M03_U4"
 * data-async: que indioca si la càrrega cal fer-la asincrona o síncrona. Es tracta d'un atrubut que admet només dos valors, true o false.
 * 
 * La càrrega d'aquest codi implica l'execució de la funció createReplacerFromTagConfig
 */
$(document).ready(function () {
    var iocReplacer ={
        init:function(url, id, async, onError){
            this.url=url;
            this.id=id;
            this.async=async;
            this.onError=onError;        
        },    
        
        get url(){
            return this.__url__;
        },
        
        get id(){
            return this.__id__;
        },
        
        get async(){
            return this.__async__;
        },
        
        get onError(){
            return this.__onError__;
        },
        
        set url(value){
            let dirToReplace, indexOfDir_i, indexOfDir_e;
            if(location.search){
                dirToReplace = location.search;
                indexOfDir_i = dirToReplace.indexOf("trf=");
                if(indexOfDir_i==-1){
                    indexOfDir_i=1;
                }else{
                    indexOfDir_i+=4;
                }
                indexOfDir_e = dirToReplace.indexOf("&", indexOfDir_i);
                if(indexOfDir_e==-1){
                    dirToReplace = "/"+dirToReplace.substring(indexOfDir_i);
                }else{
                    dirToReplace = "/"+dirToReplace.substring(indexOfDir_i, indexOfDir_e);
                }
                if(dirToReplace.indexOf("=")>-1){
                    dirToReplace="";
                }
                this.__url__ = value.substring(0,value.lastIndexOf("/")).concat(
                                                dirToReplace,
                                                value.substring(value.lastIndexOf("/")));
            }else{
                this.__url__ = value;
            }
        },
        
        set id(value){
            this.__id__ = (typeof value === 'string')?value:"";
        },
        
        set async(value){
            if(typeof value ==='string'){
                this.__async__ = value === 'true' || value === 't' || value === 'yes' || value === 'y';
            }else if(value){
                this.__async__ = true;
            }else{
                this.__async__ = false;
            }
        },
        
        set onError(value){
            if(typeof value ==='function'){
                this.__onError__ = value;
            }else{
                this.__onError__ = function(){
                    alert( "error" );
                };
            }
        },

        toReplaceOnLoad:function(url, id, async/*|onError*/, onError){ //or toReplaceOnLoad(url, id, onError) or toReplaceOnLoad(url, id) or toReplaceOnLoad(url) or toReplaceOnLoad()
            if(typeof url ==='function' && id===undefined && async===undefined && onError===undefined){
                onError = url;
                url = this.url;
                async = this.async;
            }else if(async===undefined && onError===undefined){
                async=this.async;
                onError = this.onError;
            }else if(onError===undefined){
                if(typeof async ==='function'){
                    onError=async;
                    async = this.async;
                }
            }
            if(id===undefined){
                id = this.id;
            }
            if(url===undefined){
                url = this.url;
            }
            $.ajax({
                url:url,
                dataType: "json",
                async: async,
                method: "POST",
                crossDomain: true,
            }).done(function(data) {
               var defaultValues = data["defaultValues"];
               var fReplaceByFile = function(url, type, selector){
                    $.ajax({
                        url:url,
                        dataType: type,
                        async: false,
                        method: "POST",
                        crossDomain: true,
                    }).done(function(value){                
                        $(selector)[type](value);
                    }).fail(function(){
                        $(selector)[type]("Error");
                    });
               }
               var getValue = function(value, defaultValues, data){
                   var ret;
                   if(typeof value === "string"){
                       ret = value;
                   }else{
                       if(value.defaultValue){
                           value = defaultValues[value.defaultValue];
                       }
                       if(value.type=="arrayText"){
                           ret = "";
                            if(value.value.length>0){
                                ret = getValue(value.value[0], defaultValues, data);
                            }
                            for(var i=1; i<value.value.length; i++){
                                ret += ("separator" in value)?value.separator:"/";
                                ret += getValue(value.value[i], defaultValues, data);
                            }
                       }else if(value.type=="ref"){
                           value = data[value.name][value.value].value;
                           ret = getValue(value, defaultValues, data);
                       }else if(value.type=="text"){
                           ret = value.value;
                       }
                   }   
                   return ret;
               };
               var fReplaceData = function(selector, activity, defalutValues) {
                   if(!activity){
                       return;
                   }
                   if(activity.defaultValue){
                       activity = defaultValues[activity.defaultValue];
                       fReplaceData(selector, activity, defalutValues);
                   }else if(activity.type === "ref"){
                        var refActivity = data[activity.name][activity.value];
                        fReplaceData(selector, refActivity, defalutValues);
                   }else if(activity.type==="arrayText"){
                       var value = getValue(activity, defalutValues, data);
                       $(selector).text(value);
                   }else if(activity.type==="file/text"){
                       var value;
                       if(typeof activity.value === "string"){
                           value = activity.value;
                       }else{
                           value = getValue(activity.value, defalutValues, data);
                       }
                       fReplaceByFile(value, "text", selector);
                   }else if(activity.type==="file/html"){
                       var value;
                       if(typeof activity.value === "string"){
                           value = activity.value;
                       }else{
                           value = getValue(activity.value, defalutValues, data);
                       }
                       fReplaceByFile(value, "html", selector);
                   }else if(activity.type==="text"){
                       var value;
                       if(typeof activity.value === "string"){
                           value = activity.value;
                       }else{
                           value = getValue(activity.value, defalutValues, data);
                       }
                       $(selector).text(value);
                   }else if(activity.type=="html"){
                       var value;
                       if(typeof activity.value === "string"){
                           value = activity.value;
                       }else{
                           value = getValue(activity.value, defalutValues, data);
                       }
                       $(selector).html(value);
                   }else if(activity.type=="attr"){
                       var value, name;
                       if(typeof activity.value === "string"){
                           value = activity.value;
                       }else{
                           value = getValue(activity.value, defalutValues, data);
                       }
                       if(typeof activity.name === "string"){
                           name = activity.name;
                       }else{
                           name = getValue(activity.name, defalutValues, data);
                       }
                       $(selector).attr(name, value);
                   }           
                };
                var activities = data[id];    
                for(var i in activities){
                    var activity = activities[i];
                    var selector = activity.selector;
                    fReplaceData(selector, activity, defaultValues);
                }
            }).fail(onError);    
        }    
    }

    var runReplacerFromTagConfig = function (replacer){
        $("replacer-config").each(function(){
            replacer.init(
                $(this).data("url"),
                $(this).data("id"),
                $(this).data("async"),
            );
            replacer.toReplaceOnLoad();
        });
    }

    runReplacerFromTagConfig(iocReplacer);
});
