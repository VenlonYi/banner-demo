(function (){
    let currentPlayIndex = 0
    let intelval

    const fn = {
        /* 获取dom */
        $(selector, dom = document) {
           return dom.querySelector(selector)
        },
        /* 添加dom子元素 */
        appendChildren(parent, ...children) {
            children.forEach( child => {
                parent.appendChild(child)
            })
        },
        /**
         * @param wrapper 外层包裹元素
         * @param listNode 列表
         * @param element 内容元素
         * @param elementData 内容元素的属性
         * */
        createElementByFrag({wrapper,wrapperClass,isDots, list, element, elementData = []}) {
            let wrapperNode = document.createElement(wrapper)
            if (wrapperClass) wrapperNode.setAttribute('class', wrapperClass)
            let fragment = document.createDocumentFragment()
            let bannerLength = isDots ? elementData.length : elementData.length + 1 // 加一个长度复制第一个元素,方便循环
            // 循环遍历data数据中每个属性和值,并添加到代码片段fragment中
            elementData.forEach( dataItem => {
                let listNode = document.createElement(list)
                let elementNode = document.createElement(element)
                Object.keys(dataItem).forEach( key => {
                    elementNode.setAttribute(key, dataItem[key])
                })
                listNode.append(elementNode)
                if(!isDots) {
                    listNode.style.width = (100 / bannerLength) + '%'
                }
                fragment.append(listNode)
                // console.log(fragment)
            })
            // console.log(fragment)
            wrapperNode.appendChild(fragment)
            if(!isDots) {
                wrapperNode.appendChild(wrapperNode.firstChild.cloneNode(true)) // 复制第一个节点,方便循环
            } else {
                this.avtiveDots(0)
            }

            wrapperNode.style.width = bannerLength * 100 + '%'
            return {wrapperNode, bannerLength};
        },
        bannerPlay(el, bannerLength) {
            el.style.transition = 'all .5s'; 
            currentPlayIndex++

            this.avtiveDots(currentPlayIndex)
            console.log(currentPlayIndex)

            let move = -(100/bannerLength)*currentPlayIndex
            el.style.transform = `translateX(${move}%)`
            if(currentPlayIndex >= bannerLength -1) {
                this.avtiveDots(0)
                setTimeout(()=> {
                    el.style.transition = 'none';
                    el.style.transform = 'none'
                    currentPlayIndex = 0
                },500)
             }
        }, 
        avtiveDots (index) {
            setTimeout(()=> {
                this.$('.dots').childNodes.forEach((el, i) => {
                    // console.log(i,index)
                    // console.log(el, i ,d)
                    if (index === i) {
                        el.setAttribute('class','active')
                    } else {
                        el.setAttribute('class','')
                    }
                })
            },0)
        }
    }
    /* 创建方法,初始化函数 */
    const LightBanner =  function (el, data,  options) {
        this.createElement(el, data, options)
        this.bindEvent()
    }

    // 创建dom元素
    LightBanner.prototype.createElement = function(el, data,  options) {
        const element =  fn.$(el) // 整体挂载点
        // 创建banner列表
        let bannerListFrag = {
            wrapper: 'ul',
            list: 'li',
            element: 'img',
            elementData: data
        }
        let {wrapperNode, bannerLength} =  fn.createElementByFrag(bannerListFrag)
        element.appendChild(wrapperNode) //挂载到页面
        // 创建圆点
        let dotListFrag = {
            wrapper: 'div',
            wrapperClass: 'dots',
            list: 'div',
            element: 'span',
            isDots: true,
            elementData: ['','','','','']
        }
        let {wrapperNode:dotsNode } =  fn.createElementByFrag(dotListFrag)
        element.appendChild(dotsNode) //挂载到页面
        // 设置自动播放
        intelval =  setInterval( ()=> {
            fn.bannerPlay(wrapperNode, bannerLength)
        }, 2000)
    }

    LightBanner.prototype.bindEvent = function () {

    }

    window.LightBanner = LightBanner
})(window, document)