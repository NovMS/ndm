const reducer = (state, action) => {

    if (state === undefined){
        return {
            photos : []
        }
    }

    switch (action.type) {
        
        case 'ADD_PHOTOS' : {
            return {
               photos : [ ...state.photos , ...action.payload]
            }
        }

        case 'DROP_PHOTOS' : {
            return { 
                photos : []
            }
        }

        case 'DROP_PHOTO_ONLY' : {
            let tmp = state.photos
            tmp.splice(action.index,1)
            return {
                photos : [ ...[],...tmp]
            }
        }
        
        default:
            return state;
    }


}

export default reducer