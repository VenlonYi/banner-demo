(function () {
    let currentPlayIndex = 0
    let bannerListLength = 0
    let wrapPlayNode
    let playIntelval

    const fn = {
        /* 获取dom */
        $(selector, dom = document) {
            return dom.querySelector(selector)
        },
        /* 添加dom子元素 */
        appendChildren(parent, ...children) {
            children.forEach(child => {
                parent.appendChild(child)
            })
        },
        /**
         * @param wrapper 外层包裹元素
         * @param listNode 列表
         * @param element 内容元素
         * @param elementData 内容元素的属性
         * */
        createElementByFrag({
            wrapper,
            wrapperClass,
            isDots,
            list,
            element,
            elementData = []
        }) {
            let wrapperNode = document.createElement(wrapper)
            if (wrapperClass) wrapperNode.setAttribute('class', wrapperClass)
            let fragment = document.createDocumentFragment()
            let bannerLength = isDots ? elementData.length : elementData.length + 1 // 加一个长度复制第一个元素,方便循环
            // 循环遍历data数据中每个属性和值,并添加到代码片段fragment中
            elementData.forEach(dataItem => {
                let listNode = document.createElement(list)
                let elementNode = document.createElement(element)
                Object.keys(dataItem).forEach(key => {
                    elementNode.setAttribute(key, dataItem[key])
                })
                listNode.append(elementNode)
                if (!isDots) {
                    listNode.style.width = (100 / bannerLength) + '%'
                }
                fragment.append(listNode)
                // console.log(fragment)
            })
            // console.log(fragment)
            wrapperNode.appendChild(fragment)
            wrapperNode.appendChild(wrapperNode.firstChild.cloneNode(true)) // 复制第一个节点,方便循环
            wrapperNode.style.width = bannerLength * 100 + '%'
            return {
                wrapperNode,
                bannerLength
            };
        },
        /* 播放幻灯片 */
        bannerPlay(el, bannerLength) {
            // console.log(bannerLength, currentPlayIndex)
            currentPlayIndex++
            this.picMove({
                el,
                transition: 'all .3s',
                bannerLength,
                currentPlayIndex
            })
            if (currentPlayIndex >= bannerLength - 1) {
                this.avtiveDots(0)
                setTimeout(() => {
                    // this.picMove({el})
                    el.style.transition = 'none';
                    el.style.transform = 'none'
                    currentPlayIndex = 0
                }, 500)
            }
        },
        picMove({
            el,
            transition,
            bannerLength,
            currentPlayIndex
        }) {
            if (!el) {
                return
            } else {
                console.log(currentPlayIndex)
                this.avtiveDots(currentPlayIndex)
                el.style.transition = transition
                el.style.transform = `translateX(${-(100/bannerLength)*currentPlayIndex}%)`
            }
        },
        avtiveDots(index) {
            this.$('.dots').childNodes.forEach((el, i) => {
                if (index === i) {
                    el.setAttribute('class', 'active')
                } else {
                    el.setAttribute('class', '')
                }
            })
        }
    }
    /* 创建方法,初始化函数 */
    const LightBanner = function (el, data, options) {
        this.el = el
        this.createElement(el, data, options)
        this.bindEvent()
    }

    // 创建dom元素
    LightBanner.prototype.createElement = function (el, data, options) {
        // 整体挂载点
        const element = fn.$(el)
        // 创建banner列表
        let bannerListFrag = {
            wrapper: 'ul',
            list: 'li',
            element: 'img',
            elementData: data
        }
        let {
            wrapperNode,
            bannerLength
        } = fn.createElementByFrag(bannerListFrag)
        wrapPlayNode = wrapperNode
        bannerListLength = bannerLength
        element.appendChild(wrapperNode) //挂载到页面

        // 创建圆点
        let dotWrapper = document.createElement('div')
        dotWrapper.className = 'dots'
        let dotFrag = document.createDocumentFragment()
        for (let i = 0; i < data.length; i++) {
            let divFrag = document.createElement('span')
            divFrag.setAttribute('data-i', i) // 圆点下标
            dotFrag.append(divFrag)
        }
        dotWrapper.appendChild(dotFrag)
        element.appendChild(dotWrapper) //挂载到页面
        // console.log(dotWrapper)
        fn.avtiveDots(0) // 激活第一个dot样式

        // 创建左右播放按钮
        let toLeftBtn = document.createElement('div')
        let toRightBtn = document.createElement('div')
        toLeftBtn.className = 'to-left'
        toLeftBtn.innerText = '<'
        toRightBtn.className = 'to-right'
        toRightBtn.innerText = '>'

        element.appendChild(toLeftBtn)
        element.appendChild(toRightBtn)

        // 设置自动播放
        playIntelval = setInterval(() => {
            fn.bannerPlay(wrapperNode, bannerLength)
        }, 2000)
    }

    LightBanner.prototype.bindEvent = function () {
        const container = fn.$(this.el)

        // 移入时禁止播放
        container.onmouseover = () => {
            clearInterval(playIntelval)
        }
        container.onmouseleave = () => {
            clearInterval(playIntelval)
            playIntelval = setInterval(() => {
                fn.bannerPlay(wrapPlayNode, bannerListLength)
            }, 2000)
        }

        // dot事件委托
        fn.$('.dots').onclick = (e) => {
            if (e.target.tagName.toLowerCase() === 'span') {
                let index = Number(e.target.getAttribute('data-i'))
                currentPlayIndex = index
                console.log(currentPlayIndex, index)
                fn.picMove({
                    el: wrapPlayNode,
                    transition: 'all .3s',
                    bannerLength: bannerListLength,
                    currentPlayIndex
                })
            }
        }
        // 左右按钮
        fn.$('.to-right').onclick = () => {
            fn.bannerPlay(wrapPlayNode, bannerListLength)
        }
        fn.$('.to-left').onclick = () => {
            if (currentPlayIndex < 1) {
                currentPlayIndex = 5
                fn.picMove({
                    el: wrapPlayNode,
                    transition: 'none',
                    bannerLength: bannerListLength,
                    currentPlayIndex: currentPlayIndex
                })
                // 延时0毫秒，把刚刚去掉的过渡加上的同时，再进行移动
                setTimeout(() => {
                    currentPlayIndex--
                    fn.picMove({
                        el: wrapPlayNode,
                        transition: 'all .3s',
                        bannerLength: bannerListLength,
                        currentPlayIndex
                    })

                }, 0)

            } else {
                currentPlayIndex--
                fn.picMove({
                    el: wrapPlayNode,
                    transition: 'all .3s',
                    bannerLength: bannerListLength,
                    currentPlayIndex
                })
            }
        }
    }

    window.LightBanner = LightBanner
})(window, document)