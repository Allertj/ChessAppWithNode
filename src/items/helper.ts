import { Pawn, Queen, King, Knight, Bishop, Rook} from './main_types'

function replacer(key: string, value: Object) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), 
      };
    } else {
      return value;
    }
  }

function reviver(key: string, value: any) {
    let types = {"R": Rook, "B": Bishop, "K": Knight, "M": King, "Q": Queen, "P": Pawn}
    if(typeof value === 'object' && value !== null) {
        if (value.typeletter) {
            const {x, y, typeletter, moved, player} = value
            //@ts-expect-error
            return new types[typeletter](x, y, player, moved)
        }
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
    }

export {replacer, reviver}