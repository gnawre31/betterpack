import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { immer } from 'zustand/middleware/immer'



interface Inventory {
    packs: Pack[],
    gear: Item[],

    newPack: () => void
    newCategory: (pack_id: UUID, payload: Category) => void,
    newItem: (pack_id: UUID, category_id: UUID, payload: Item) => void,

    updatePack (pack_id:UUID, payload: Pack) => void,
    updateCategory: (pack_id: UUID, category_id: UUID, payload: Category) => void,
    updateItem: (pack_id: UUID, category_id: UUID, item_id: UUID, payload: Item ) => void

    deletePack: (pack_id: UUID) => void,
    deleteCategory: (pack_id: UUID, category_id: UUID) => void,
    deleteItemFromPack: (pack_id: UUID, category_id: UUID, item_id: UUID) => void,
    deleteItemFromInventory: (item_id: UUID) => void,
    
}

interface Pack {
    pack_id: UUID,
    pack_name: string,
    trail: string,
    categories: Category[],
    
}
interface Category {
    category_name: string,
    category_desc: string,
    category_id: string | null,
    items: Item[]
}
interface Item {
    item_id: string | null,
    item_name: string,
    item_brand: string,
    item_type: string,
    item_link: string,
    item_weight: number | null
    item_unit: string,
    item_price: number | null,
    item_quantity: number, 
}



export const useInventoryStore = create < Inventory > ()(immer((set) => ({
    packs: [],
    gear: [],
    newPack: () => {
        const newPack = {
            pack_id: uuidv4(),
            pack_name: "",
            trail: "",
            categories: [],
        }
        set((state) => ({
            packs: [...state.packs, newPack]
        }))
    },
    newCategory: (pack_id, payload) => 
        set((state) => ({
            packs: state.packs.map(pack => {
                if (pack.pack_id === pack_id) {
                    return [...pack.categories, payload]
                }
                return pack
            })
        })
    ),
    newItem: (pack_id, category_id, payload) => {
        // add item to category list 
        set((state) => ({
            packs: state.packs.map(pack => {
                if (pack.pack_id == pack_id) {
                    const categories = pack.categories.map(category => {
                        if(category.category_id === category_id) {
                            return [...category.items, payload]
                        }
                        return category
                    })
                    return {...pack, categories}
                }
                return pack
            })
        }))

        // add to inventory if does not exist
        const gear = useInventoryStore.getState().gear;
        const item = gear.find(i => i.item_id === payload.item_id) 
        if (item === undefined) {
            set((state) => ({
                gear: [...state.gear, payload]
            }))
        }
    },

    updatePack: (pack_id, payload) => set((state) => ({
        packs: state.packs.map(pack => {
            if (pack.pack_id === pack_id) return payload
            return pack
        })
    })),

    updateCategory: (pack_id, category_id, payload) => set((state) => ({
        packs: state.packs.map(pack => {
            if (pack.pack_id === pack_id) {
                const updatedCategories = pack.categories.map(category => {
                    if (category.category_id === category_id) return payload
                    return category
                })
                return {...pack, categories: updatedCategories}
            }
            return pack
        })
    })),

    updateItem: (pack_id, category_id, item_id, payload) => {
        // update item in category
        set((state) => ({
            packs: state.packs.map(pack => {
                if (pack.pack_id === pack_id) {
                    const updatedCategories = pack.categories.map(category => {
                        if (category.category_id === category_id) {
                            const updatedItems = category.items.map(item => {
                                if (item.item_id === item_id) return payload
                                return item
                            })
                            return {...category, items: updatedItems}
                        }
                        return category
                    })
                    return {...pack, categories: updatedCategories}
                }
                return pack
            })
        }))

        // update item in gear
        set((state) => ({
            gear: state.gear.map(item => {
                if (item.item_id === item_id) return payload
                return item
            })
        }))
    },




    deletePack: (pack_id) => set((state) => ({
        packs: state.packs.filter(pack => pack.pack_id !== pack_id)
    })),
    deleteCategory: (pack_id, category_id) => set((state) => ({
        packs: state.packs.map(pack => {
            if (pack.pack_id === pack_id) {
                const updatedCategories = pack.categories.filter(category => category.category_id !== category_id)
                return {...pack, categories: updatedCategories }
            }
            return pack
        })
    })),
    deleteItemFromPack: (pack_id, category_id, item_id) => set((state) => ({
        packs: state.packs.map(pack => {
            if (pack.pack_id === pack_id) {
                const updatedCategories = pack.categories.map(category => {
                    if (category.category_id === category_id) {
                        const updatedItems = category.items.filter(item => item.item_id !== item_id)
                        return {...category, items: updatedItems}
                    }
                    return category
                })
                return {...pack, categories: updatedCategories}
            }
            return pack
        })
    })),
    deleteItemFromInventory: (item_id) => set((state) => ({
        gear: state.gear.filter(item => item.item_id != item_id)
    }))

})))


