/**
 * Created by dinglicom on 2014/10/17.
 */
//1.在页面加载完毕时执行函数的操作，参数是所执行函数的名字
function addLoadEvent(func){
    var oldonload = window.onload;
    if(typeof window.onload != "function"){
        window.onload = func;
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}
//2.在目标元素之后添加新元素，dom本身有insetBefore,但是是没有insertAfter的，所以我们为了使用方便，定义函数insertAfter
function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}

//3.添加新的类的函数
function addClass(element,value){
    if(!element.className){
        element.className = value;
    }else{
        var newClassname = element.className;
        var newClassname = "";
        newClassname += value;
        element.className = newClassname;
    }
}
//4.dom创建img,p为showPic脚本服务
function preparePlaceholder(){
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    if(!document.createElement) return false;
    if(!document.createTextNode) return false;
    var image = document.createElement("img");
    image.setAttribute("src","images/placeholder.gif");
    image.setAttribute("alt","my image gallery");
    image.setAttribute("id","placeholder");
    var para = document.createElement("p");
    para.setAttribute("id","description");
    var txt = document.createTextNode("choose an image");
    para.appendChild(txt);
//    document.body.appendChild(image); 这样做是依赖于一个细节问题：这样刚刚好是在本来所有元素的末尾插入元素，要是我们的要求是不在文档末尾插入，我们这样做就不可以了。
//    document.body.appendChild(para);  所以我们要另外想办法，使用insertAfter的自定义函数，在元素之后插入新元素，就如下操作
    var gallery = document.getElementById("imagegallery");
    insertAfter(image,gallery);
    insertAfter(para,image);
}
addLoadEvent(preparePlaceholder);

//5.用来替换占位符图片的src属性的脚本
function showPic(whichPic){
    if(!document.getElementById) return false;
    if(!document.getElementById("placeholder")) return false;
    if(!document.getElementById("description")) return false;
    var source = whichPic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    if(placeholder.nodeName != "IMG") return false;
    placeholder.setAttribute("src",source);
    var para = document.getElementById("description");
    var title = whichPic.getAttribute("title") ?  whichPic.getAttribute("title") : "" ;
    if(para.lastChild.nodeType == 3){
        para.lastChild.nodeValue = title;
    }
}

//6.把相关的操作关联到onclick事件之上
function prepareGallery(){
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    if(!document.getElementsByTagName) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for(var i = 0;i < links.length;i++){
        links[i].onclick = function(){
            showPic(this); //这里也可以写成 return showPic(this) ? false : true;
            return false; //或者是这样：return !showPic(this);
        }
    }
}
addLoadEvent(prepareGallery);

//7.显示缩略语列表在页面上
function displayAbbreviations(){
    if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;
    if(!document.createTextNode) return false;
    if(!document.createElement) return false;
    var abbreviations = document.getElementsByTagName("abbr");
    if(abbreviations.length < 1) return false;
    var defs = [];
    for(var i =0 ;i < abbreviations.length;i++){
        var definition = abbreviations[i].getAttribute("title");
        var key = abbreviations[i].lastChild.nodeValue;
        defs[key] = definition;
    }
    var dlist = document.createElement("dl");
    dlist.setAttribute("id","list");
    for(var key in defs){
        var dtitle = document.createElement("dt");
        var ddesc = document.createElement("dd");
        var dtitle_txt = document.createTextNode(key);
        var ddsec_txt = document.createTextNode(defs[key]);
        dtitle.appendChild(dtitle_txt);
        ddesc.appendChild(ddsec_txt);
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    var header = document.createElement("h2");
    var header_txt = document.createTextNode("Abbreviations");
    header.appendChild(header_txt);
    header.setAttribute("id","header_abbr");
    var tb = document.getElementById("liveTable");
    insertAfter(header,tb);
    insertAfter(dlist,header);
}
addLoadEvent(displayAbbreviations);

//8根据指定的ID显示相应的<section>,同时隐藏其他的部分
function showSection(selectedId){
    var sections = document.getElementsByTagName("section");
    for(var i = 0;i<sections.length;i++){
        var current_section = sections[i];
        if(current_section.getAttribute("id") == selectedId){
            current_section.style.display = "block";
        }else{
            current_section.style.display = "none";
        }
    }
}

//9.单击一个内部链接，会显示相应的内容，其中会调用showSection函数
function prepareInternalnav(){
    if(!document.getElementById) return false;
    if(!document.getElementById("aboutList")) return false ;
    if(!document.getElementsByTagName) return false;
    var linkLists = document.getElementById("aboutList");
    var links = linkLists.getElementsByTagName("a");
    for(var i = 0;i < links.length;i++){
        var selectedId = links[i].getAttribute("href").split("#")[1];
        if(!document.getElementById(selectedId)) continue;
        var sec = document.getElementById(selectedId);
        sec.style.display = "none"; //首先是所对应的片段都不显示
        links[i].destnation = selectedId; //存的是Id，就是上面的函数showSection对应得参数
        links[i].onclick = function(){
            showSection(this.destnation);
            return false;
        }
    }
}
addLoadEvent(prepareInternalnav);

//10.显示斑马线的条纹,就是在偶数行给它加特定的类，使得偶数行显示另外的效果
function stripeTables(){
    if(!document.getElementById) return false;
    if(!document.getElementById("liveTable")) return false;
    var table = document.getElementById("liveTable");
    var odd = false;
    var rows = table.getElementsByTagName("tr");
    if(rows.length < 1) return false;
    for(var i = 0;i<rows.length;i++){
        if(odd){
            addClass(rows[i],"odd"); //给偶数行添加新类odd
            odd = false;
        }else{
            odd = true;
        }
    }
}
addLoadEvent(stripeTables);

//11.鼠标悬浮于某一行的时候，改行会发生高亮显示，鼠标离开的时候，又恢复于自己原来的状态
function highlightRows(){
    if(!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName("tr");
    if(rows.length < 1) return false;
    for(var i = 0;i < rows.length;i++){
        rows[i].oldClassName = rows[i].className;
        rows[i].onmouseover = function(){ //鼠标悬浮的时候，添加新的类highlight
            addClass(this,"highlight");
        }
        rows[i].onmouseout = function(){ //鼠标离开的时候，恢复正常就是自己的原始状态
            this.className = this.oldClassName;
        }
    }
}
addLoadEvent(highlightRows);

//12.使得当前页面的链接突出显示,这里的链接是在导航处的链接,也就是使得链接高亮显示
function highlightPage(){
    if(!document.getElementById) return false;
    if(!document.getElementById("navigation")) return false;
    if(!document.getElementsByTagName) return false;
    var nav = document.getElementById("navigation");
    var links = nav.getElementsByTagName("a");
    for(var i = 0;i<links.length;i++){
        var linkUrl = links[i].getAttribute("href");
        if(window.location.href.indexOf(linkUrl)!=-1){ //比较当前页面的链接和导航链接，如果比较结果相同的话，添加新的类here
            links[i].className = "here";
        }
    }
}
addLoadEvent(highlightPage);

//10.移动元素，去实现js幻灯片
function moveElement(elementId,final_x,final_y,interval){
    var elem = document.getElementById(elementId);
    if(elem.movement){
        clearTimeout(elem.movement);
    }
    if(!elem.style.left){
        elem.style.left = "0px";
    }
    if(!elem.style.top){
        elem.style.top = "0px";
    }
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    if(xpos == final_x && ypos == final_y){
        return true;
    }
    if(xpos < final_x){
        var dist = Math.ceil((final_x-xpos)/10);
        xpos = xpos + dist;
    }
    if(xpos > final_x){
        var dist = Math.ceil((xpos-final_x)/10);
        xpos = xpos - dist;
    }
    if(ypos < final_y){
        var dist = Math.ceil((final_y-ypos)/10);
        ypos = ypos + dist;
    }
    if(ypos > final_y){
        var dist = Math.ceil((xpos-final_y)/10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    var repeat = "moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
    elem.movement = setTimeout(repeat,interval);
}

//创建幻灯片元素，准备相应的链接
function prepareSlideshow(){
    if(!document.getElementById) return false;
    if(!document.getElementById("info")) return false;
    if(!document.getElementsByTagName) return false;
    var info = document.getElementById("info");
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id",slideshow);
//    var frame = document.createElement("img");
//    frame.setAttribute("src","images/frame.gif");
//    frame.setAttribute("alt","");
//    frame.setAttribute("id","frame");
//    slideshow.appendChild(frame);
    var preview = document.createElement("img");
    preview.setAttribute("id","preview");
    preview.setAttribute("alt","a glimpse of what awaits you");
    preview.setAttribute("src","images/slideshow.gif");
    slideshow.appendChild(preview);
    insertAfter(slideshow,info);
    var links = document.getElementsByTagName("a");
    var destination;
    for(var i = 0;i < links.length;i++){
        links[i].onmouseover = function(){
            destination = this.getAttribute("href");
            if(destination.indexOf("index.html") != -1){
                moveElement("preview",0,0,5);
            }
            if(destination.indexOf("about.html")!=-1){
                moveElement("preview",-150,0,5)
            }
            if(destination.indexOf("photos.html")!=-1){
                moveElement("preview",-300,0,5)
            }
            if(destination.indexOf("live.html")!=-1){
                moveElement("preview",-450,0,5)
            }
            if(destination.indexOf("contact.html")!=-1){
                moveElement("preview",-600,0,5)
            }
        }
    }
}
//addLoadEvent(prepareSlideshow); //这个功能还没有实现

//点击标签可以获得焦点，label标签中的for属性和input标签中id属性关联，这个也许有些较早的浏览器还不支持
function focusLabels(){
    if(!document.getElementsByTagName) return false;
    var labels = document.getElementsByTagName("label");
    for(var i = 0;i<labels.length;i++){
        if(!labels[i].getAttribute("for"))  continue;
        labels[i].onclick = function(){
            var id = labels.getAttribute("for");
            if(!document.getElementById("id")) return false;
            var elem = document.getElementById(id);
            elem.focus();
         }
    }
}

//重置默认值,就像是placeholder
function resetField(whichform){
    for(var i =0;i<whichform.elements.length;i++){
        var elem = whichform.elements[i];
        if(elem.type == "submit") continue;
        if(!elem.defaultValue) continue;
        elem.onfocus = function(){
            if(this.value == this.defaultValue){
                this.value = "";
            }
        }
        elem.onblur = function(){
            if(this.value == ""){
                this.value = this.defaultValue;
            }
        }

    }
}

//判断区域是否是填充满了
function isFilled(field){
    if(field.value.length < 1||field.value == field.defaultValue){
        return false;
    }else{
        return true;
    }
}

//使用正则表达式，验证邮箱地址是否合法
function isEmail(field){  //?匹配0或1次，*匹配0或任意多次，+匹配1次或任意多次
    var reg = /^([A-Z0-9a-z]+[_|\-|\.]?)*[A-Z0-9a-z]+@([A-Z0-9a-z]+[_|\-|\.]?)*[A-Z0-9a-z]+\.[a-zA-Z]{2,3}$/;
    if(!reg.test(field.value)){
        return false;
    }else{
        return true;
    }
}

//验证表单
function validateForm(whichform){
    for(var i =0;i<whichform.elements.length;i++){
        var elemment = whichform.elements[i];
        if(elemment.className.indexOf("required")!=-1){
            if(!isFilled(elemment)){
                alert("Please fill in the "+elemment.name+" field");
                return false;
            }
        }
        if(elemment.className.indexOf("email")!=-1){
            if(!isEmail(elemment)){
                alert("The "+elemment.name+" field must be a valid email address.");
                return false;
            }
        }
    }
    return true;
}

function prepareForms(){
    for(var i =0;i<document.forms.length;i++){
        var thisform = document.forms[i];
        resetField(thisform);
        thisform.onsubmit = function(){
            return validateForm(this);
        }
    }
}
addLoadEvent(focusLabels);
addLoadEvent(prepareForms);