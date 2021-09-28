// (() => {
//     let elements = document.querySelectorAll(".cilim")
//     for (element of Object.values(elements)) {
//         if (element.hasChildNodes()) {
//             let children = Object.values(element.children)
//             let numberOfChildren = children.length
//             let numberOfColumns = Math.floor(numberOfChildren / 2)
//             if (numberOfColumns % 2 !== 0) numberOfColumns -= 1
//             element.style = `grid-template-columns: repeat(${numberOfColumns}, 1fr);`
//             let dropNth = element.dataset.cilim === "up-first" ? 2 : 1
//             let dropped = element.querySelectorAll(`img:nth-child(2n+${dropNth})`)
//             dropped = Object.values(dropped)
//             for (i in dropped) {
//                 dropped[i].style = "transform: translateY(50%)"
//             }
//         }
//     }
// })()

// This code is done for practice purposes only. It will slow down loading of the page
// and take more memory. That probaly isn't enough of a trade back for making
// appearance of the zig-zag images on the page much more easier to
// handle.
// In a situation where this king of visual would be considered brand, it would make sense.
// Furthermore, there's functionality of collecting elemnts of the page that have 
// scpecific data- attribute, which could be used on other places.
// This is a first iteration of code. It needs more iterations...
// ...
//... 
//... And it's terrible code.
//... And it only adds complexity. 
// But it's something to work on.

// Collect all elements that have specific data- attribute, given in constructor
class DatasetCollectorAll {
    #attribute
    #elements
    constructor({ datasetAttribute }) {
        this.#attribute = datasetAttribute
        this.#elements = Object.values(document.querySelectorAll(`[data-${this.#attribute}]`))
            .map((element, index) => {
                return {
                    attributeValue: element.dataset[`${this.#attribute}`],
                    DOMElement: element,
                    children: {
                        DOMChildren: Object.values(element.children),
                    },
                    numberOfChildren: element.childElementCount
                }
            })
    }

    getAttribute() {
        return this.#attribute
    }
    getElements() {
        return this.#elements
    }
    setElements(elements) {
        this.#elements = elements
    }
    getValues() {
        return this.#elements.map(element => element.attributeValue)
    }
    getChildren() {
        return this.#elements.map((element, index) => {
            return element.children
        })
    }
    getNumberOfChildren() {
        return this.#elements.map(element => element.numberOfChildren)
    }
    filterByValue(attributeValue) {
        return this.#elements.filter(element => element.attributeValue === attributeValue)
    }
}


// Collect only the first element that has data- attribute given in constructor


class ZigZag extends DatasetCollectorAll {
    constructor(numberOfRows = 2) {
        super({ datasetAttribute: "zigzag" })

        this.numberOfRows = numberOfRows // Make number of rows mutable. Make number of rows elements property.
        this.getElements().map((element, index) => {
            let numberOfChildren = this.getNumberOfChildren()
            let length = numberOfChildren[index]

            element.numberOfRows = numberOfRows // Make number of rows mutable
            // Make sure that number of columns is divisible by 2 so every new 
            // row starts with the same transformation (dow-first, up first...)
            let prospect = Math.floor(length / this.numberOfRows)
            element.numberOfColumns = prospect % 2 === 0 ? Math.floor(length / prospect) : Math.ceil(length / this.numberOfRows)
        })
    }
    setElementsByValue(value) {
        if (value === "" || value === undefined || value === null) {
            console.error("This will delete all of the elements")
        } // Any parameter that doesn't fit existing value will delete all elements.
        this.setElements(this.filterByValue(value))
        return this.getElements()
    }
    setGridStyle() {
        this.getElements().forEach(element => {
            element.DOMElement.style.display = "grid"
            element.DOMElement.style.gridTemplateColumns = `repeat(${element.numberOfColumns}, 1fr)`
        })
    }
}

class DonwFirstZigzag extends ZigZag {
    constructor(numberOfRows) {
        super()
        this.setElementsByValue("down-first")
        this.getElements().forEach((element, index) => {
            element.children.parentIndex = index
        })
    }
    setZigZagStyle() {
        this.getChildren().forEach(children => {
            for (let index = 0; index < children.DOMChildren.length; index++) {
                children.DOMChildren[index].style.setProperty("transform", "translateY(50%)")
                if (index + 1 === this.getElements()[children.parentIndex].numberOfColumns) continue
                index++
            }
        })
    }
}

class UpFirstZigzag extends ZigZag {
    constructor() {
        super()
        this.setElementsByValue("up-first")
        this.getElements().forEach((element, index) => {
            element.children.parentIndex = index
        })
    }
    setZigZagStyle() {
        this.getChildren().forEach(children => {
            for (let index = 1; index < children.DOMChildren.length; index++) {
                if (index === this.getElements()[children.parentIndex].numberOfColumns) continue
                children.DOMChildren[index].style.setProperty("transform", "translateY(50%)")
                index++
            }
        })
    }
}


let downFirstZigzag = new DonwFirstZigzag("down-first")
downFirstZigzag.setGridStyle()
downFirstZigzag.setZigZagStyle()
let upFirstZigzag = new UpFirstZigzag("up-first")
upFirstZigzag.setGridStyle()
upFirstZigzag.setZigZagStyle()
