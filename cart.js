let myData = ""
let carts = null
const zems_cart = (data) => { 
    myData = data 
    var ckcarts = localStorage.getItem('zems_cart')
    ckcarts = JSON.parse(ckcarts)
    
    carts = ckcarts
    if (carts !== null){
        if(carts[myData.id] !== undefined){
            var up_method = "add"
            var up_id = myData.id
            var child_id = null
            if(myData.child.id){
                child_id = myData.child.id
            }
            updateCart(up_method, up_id, child_id)
        } else {
            
            addToCart()
        }
    } else {
        localStorage.setItem("zems_cart", JSON.stringify({}));
        addToCart()
    }
    return
};

const addToCart = () => {
    if(myData.child != ""){
        addToChild()
    } else {
        let cartId = myData.id
        var qty = 1
        var carts = JSON.parse(localStorage.getItem("zems_cart"))
        carts[cartId] = {name:myData.zems_item_title, qty:qty, price: myData.price, discount:myData.discount, child:"" }
        localStorage.setItem("zems_cart", JSON.stringify(carts));     
    }
    return
}

const addToChild = () => {
    var cld = {}
    cld[myData.child.id] = {id:myData.child.id, name:myData.child.child_item_title, qty:1, price:myData.child.price, discount:myData.child.discount}
    console.log(cld);
    let cartId = myData.id
    var qty = 1
    var carts = JSON.parse(localStorage.getItem("zems_cart"))
    carts[cartId] = {name:myData.zems_item_title, qty:0, price: 0, child:cld }
    
    localStorage.setItem("zems_cart", JSON.stringify(carts));
    return
}

const updateCart = (up_method, up_id, child_id = false) => {
    var carts = JSON.parse(localStorage.getItem("zems_cart"))
    if(carts[up_id].child){
        
        if(carts[up_id].child[child_id]){
            var child_qty = carts[up_id].child[child_id].qty
            var child_price = carts[up_id].child[child_id].price
            if(up_method == "sub" && child_qty > 1){
                carts[up_id].child[child_id].qty = child_qty - 1
            } else if(up_method == 'add') {
                carts[up_id].child[child_id].qty = child_qty + 1
            } else {
                return removeFromCart(up_id, child_id)
            }
        } else {
            carts[up_id].child[myData.child.id] = {id:myData.child.id, name:myData.child.child_item_title, qty:1, price:myData.child.price, discount:myData.child.discount} 
        }
    } else {
        if(up_method == "sub" && carts[up_id].qty > 1){
            carts[up_id].qty = carts[up_id].qty - 1
        } else if(up_method == "add"){
            carts[up_id].qty = carts[up_id].qty + 1
        } else {
            return removeFromCart(up_id)
        }
    }
    localStorage.setItem("zems_cart", JSON.stringify(carts));
    return
}

const removeFromCart = (id, child_id = false) => {
    var carts = JSON.parse(localStorage.getItem("zems_cart"))
    var nCart = carts
    var qty = nCart[id].qty
    var price = (parseFloat(carts[id].price) * qty).toFixed(2)
    if(child_id){
        qty = nCart[id].child[child_id].qty;
        price = (parseFloat(nCart[id].child[child_id].price) * qty).toFixed(2)
    }
    if(child_id && Object.keys(nCart[id].child).length > 1){
        delete nCart[id].child[child_id];
    } else {
        delete nCart[id] 
    }
    carts = nCart
    localStorage.setItem("zems_cart", JSON.stringify(carts));
    return getCart()
}

const getCart = () => {
    var cart = localStorage.getItem('zems_cart')
    var carts = {} 
    if(cart != null){
        var data = JSON.parse(cart)
        carts['cart'] = data
        var qty = 0
        var tt = 0
        var dis = 0
        for (const [key, value] of Object.entries(data)) {
            var quantity = parseInt(data[key]['qty'])
            qty += quantity
            tt += parseFloat(data[key]['price']) * quantity
            if(data[key]['discount']){
                dis += parseFloat(data[key]['discount']) * quantity
            } 
            if(data[key]['child']){
                Object.keys(data[key]['child']).forEach(k => {
                    var cqty = parseInt(data[key]['child'][k]['qty'])
                    qty += cqty
                    tt += parseFloat(data[key]['child'][k]['price'] * cqty)
                    if(data[key]['child'][k]['discount']){
                        dis += parseFloat(data[key]['child'][k]['discount'] * cqty)
                    } 
                });
            }
          }
        carts['qty'] = qty  
        carts['total'] = tt.toFixed(2) 
        carts['discount'] = dis.toFixed(2) 
    } else {
        carts = {}
    }
    return carts
}

const otherAdd = (data) => {
    var cart = localStorage.getItem('zems_cart')
    cart = JSON.parse(cart)
    Object.keys(data).forEach(key => {
        cart[key] = data[key]
    });
    localStorage.setItem("zems_cart", JSON.stringify(cart));
    return cart
}
const otherRemove = (data) => {
    var cart = localStorage.getItem('zems_cart')
    cart = JSON.parse(cart)
    data.forEach(key => {
        delete cart[key]
    });
    localStorage.setItem("zems_cart", JSON.stringify(cart));
    return cart
}

export { zems_cart, getCart, myData, updateCart, removeFromCart, otherAdd, otherRemove }
