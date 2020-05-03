alert("!!!!Click anywhere on the page to test playing audio from an extension.")
document.addEventListener('click', () => {

})
var notification = webkitNotifications.createNotification(
    '128x128.png',  // icon url - can be relative
    'Hello!',  // notification title
    'Lorem ipsum...'  // notification body text
);
notification.show();



chrome.notifications.create('reminder', {
    type: 'basic',
    iconUrl: '128x128.png',
    title: 'Don\'t forget!',
    message: 'You have   things to do. Wake up, dude!'
}, function(notificationId) {
    console.log( notificationId )
});

var ParserForums = function () {
    const $ = jQuery;
    var self = this ;
    self.DEBAG = true ;
    this._setting = {
        taskName : 'fl_ru' ,
        Domen : 'https://fotosmart.artos.pp.ua' ,
        // Целевой домен парсинга
        ParseDomain : null ,
        // Интервал между проверками новых сообщений
        tInterval : 10000 ,
        href : [],
        selectors : {
            // блок с предложениями
            block : '#projects-list'  ,
            row : '.b-post' ,

        },
        get _temp_id (){
            return 'tmpEl-'+self._setting.taskName
        } ,
        get _site (){
            return location.href ;
        } ,
        mp3 : {
            // сигнал для раздела - Предлагаю работу
            alarm :  'sound/Alarm-Fast-A1.mp3',
            ring :   'sound/Alarm-Fast-High-Pitch-A3-Ring-Tone.mp3',
            note :   'sound/note.mp3'
        },
    } ;
    /**
     *
     * @type {{}}
     */
    this.rowParseResult = {} ;

    this.opts = {} ;

    this.Init = function () {
        var opt = { };
        this.opts = $.extend( true , self._setting , opt  );
    };

    this.Start = function () {
        if(self.DEBAG) console.log( '@Start this.opts', this.opts   );
        const tmpEl = $('<div />', {
            id:  self._setting._temp_id ,
        });
        $('body').append(tmpEl) ;

        this._start()
        // setInterval( this._start.bind() , this._setting.tInterval );
    };
    this._start = function () {
        self = this ;
        // Sound Start
        this.sound(0 ) ;
        this.getContentBlock();
    };
    /**
     * Загрузить Html страницы
     * извлечь блок { self._setting.selectors.block }
     */
    this.getContentBlock = function () {

        $.get({
            url : this._setting.ParseDomain ,
            success: function(date) {
                // блок с предложениями
                const $recentposts = $(date).find( self._setting.selectors.block );
                self.getText( $recentposts );
            }
        })
    };

    this.getText = function ($el) {
        var $_self = this ;


        // строка предложенеия
        const $rowElement = $el.find(self._setting.selectors.row);

        // Временный блок для хранения или развертывания елемента html
        const $tmpEl = $('#' + self._setting._temp_id );

        // Хранение закрепленных предложений

        let txt;

        $rowElement.each(function(i,a){
            $_self.ParseRow( i , a , $tmpEl );

        });
        this._CompareArray( this.rowParseResult )


    };
    /**
     * Парсинг Блока
     * @param i int             Индекс в найденных блоках
     * @param a html element    Блок
     * @param $tmpEl            Временный блок для хранения или развертывания елемента html
     * @constructor
     */
    this.ParseRow = function ( i , a , $tmpEl ) {

        // Заголовок предложения
        var $h2 = $(a).find('h2') ;
        // Текст короткого описания
        var scriptText = $h2.next().html();
        // стоимость заказа
        var script_price = $(a).children().first().html();
        // ссылка на полное описания проекта
        var $linkHtml = $h2.find('.b-post__link') ;

        var post = {
            theme : $linkHtml.text() ,
            prevText	:	getText_inScript(scriptText) ,
            price		: 	getPrice_inScript( script_price ) ,
            link  : $linkHtml.attr('href'),
        };


        if ($h2.hasClass('b-post__pin')) {
            this.rowParseResult.post__pin.push(post);
            return ;
        }
        this.rowParseResult.post.push( post ) ;

        /**
         * Получить цену проекта
         * @param scriptText
         * @returns {string}
         */
        function getPrice_inScript( scriptText ){
            var t =  getCleanHtml(scriptText) ;
            $tmpEl.append(t);
            $tmpEl.find('a').remove();
            txt = $tmpEl.text().trim();
            $tmpEl.empty();
            return txt ;
        };
        /**
         *  Получение короткого описания проекта
         */
        function getText_inScript( scriptText ){
            var t =  getCleanHtml(scriptText) ;
            $tmpEl.append(t);
            txt = $tmpEl.children().text().trim();
            $tmpEl.empty();
            return txt ;
        };
        /**
         *  Вырезать из скобок текст
         */
        function getCleanHtml(scriptText){
            return scriptText.replace(/document.write\('/g,"").replace(/'\)/g,"");
        }
    };

    /**
     * Сравнение данных из кеша с полученными данными
     * @param arr
     * @constructor
     */
    this._CompareArray = function (arr) {


        const cache = Storage_class.get(self._setting.taskName);
        if ( !cache ) {
            this.saveCache(arr);
            this.sound(0) ;
            return ;
        }
        // Сравнение данных
        self.LocalCompareArray( arr , cache )


    };
    /**
     * Сравнение данных
     * @param arr
     * @param cache
     * @constructor
     */
    this.LocalCompareArray = function ( arr , cache) {};
    /**
     * Сохранить данные в кеше
     * @param arr
     */
    this.saveCache = function ( arr ) {
        console.log(arr)
        Storage_class.set(self._setting.taskName , arr );
    };
    this.sound = function ( level ) {
        let audio;
        let url;
        switch (level) {
            case 1:
                url = chrome.runtime.getURL( this._setting.mp3.alarm );
                audio = new Audio(url);
                break;
            case 2:
                url = chrome.runtime.getURL( this._setting.mp3.ring );
                audio = new Audio(url);
                break;
            default:
                url = chrome.runtime.getURL( this._setting.mp3.note );
                console.log(url)
                audio = new Audio( url );
        }
        audio.play();
    }


};

var ParseFL = function(){
    var $ = jQuery ;
    var self = this ;
    var opt = {
        ParseDomain : 'https://www.fl.ru/projects' ,
    };


    this.Init = function () {

        self.opts = $.extend( true , self._setting , opt  );
        self.rowParseResult = {
            // массив простых обявлений
            post : [] ,
            // массив закрепленных обявлений
            post__pin : [] ,
        };
        this.Start();
    };
    /**
     * Сравнение данных
     * @param arr - Новые предложения
     * @param cache
     * @constructor
     */
    this.LocalCompareArray = function ( arr , cache) {
        var saveAction = false ;
        var cachePost = cache.post ;
        var newArr = [];
        $.each( arr.post , function (i , post ) {
            if (typeof cachePost[i] === 'undefined') {
                saveAction = true ;
                return ;
            }
            if ( post.theme !== cachePost[i].theme ){
                saveAction = true ;
                newArr[i] = post ;
            }
        } );
        if (saveAction) {

            this.saveCache(arr) ;
        }
        console.log(newArr) ;



        // console.log(cache)
        // console.log(arr)
    }

};

ParseFL.prototype = new  window.ParserForums();


window.onload = function(){

    let PLF = new  window.ParseFL();
    PLF.Init();




    chrome.tabs.onActivated.addListener(function(info) {
        console.log( info )
    });





};
