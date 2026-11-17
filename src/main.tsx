import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AnswerKeyView } from './components/AnswerKeyView';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './index.css';

// 주소 끝에 ?view=answer-key 가 있으면 선생님용 답지를 보여 줌
const isAnswerKey = new URLSearchParams(window.location.search).get('view') === 'answer-key';

createRoot(document.getElementById('root')!).render(isAnswerKey ? <AnswerKeyView /> : <App />);
