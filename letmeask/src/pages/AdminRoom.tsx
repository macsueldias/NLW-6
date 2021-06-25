//import { FormEvent, useState } from 'react';
import { useParams } from 'react-router';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../componentes/Button';
import { Question } from '../componentes/Question';
import { RoomCode } from '../componentes/RoomCode';
//import { useAuth } from '../Hooks/useAuth';
import { useRoom } from '../Hooks/useRoom';
//import { database } from '../services/firebase';

import '../styles/room.scss'
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm("Tem certeza que você deseja excluir esta pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
 
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && questions.length > 1 ? <span>{questions.length} perguntas</span> : <span>{questions.length} pergunta</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type = "button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}