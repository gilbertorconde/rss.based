import { Store } from 'pullstate';
import IStore from '../entities/IStore';

const UIStore = new Store<IStore>({
  isDarkMode: 'auto',
  feed: undefined,
});

export default UIStore;