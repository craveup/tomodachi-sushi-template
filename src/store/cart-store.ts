import {create} from "zustand/index";

type Store = {
    cartId: string
    isLoading: boolean
    setCartIdState: (newCartId: string) => void
    setIsLoading: (newLoading: boolean) => void
}

export const useCartStore = create<Store>()((set) => ({
    cartId: "",
    isLoading: false,
    setCartIdState: (newCartId) => set(() => ({ cartId: newCartId })),
    setIsLoading: (newLoading) => set(() => ({ isLoading: newLoading })),
}))
