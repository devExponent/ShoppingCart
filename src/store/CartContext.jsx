import { createContext, useState, useReducer, act } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addItems: () => {},
  updatedItems: () => {},
});

const CartContextProvider = ({ children }) => {
  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  const [shoppingCart, shoppingCartDispatch] = useReducer(cartReducer, {
    items: [],
  });

  const cartReducer = (state, action) => {
    if (type === "ADD_ITEM") {
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };

        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload
        );
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    }
    if (type === "UPDATE_QUANTITY") {
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    }

    return state;
  };

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_QUANTITY",
      productId: productId,
      amount: amount,
    });
  }

  const Cart = {
    items: shoppingCart.items,
    addItems: handleAddItemToCart,
    updatedItemsQuantity: handleUpdateCartItemQuantity,
  };
  return <CartContext value={Cart}>{children}</CartContext>;
};

export default CartContextProvider;
