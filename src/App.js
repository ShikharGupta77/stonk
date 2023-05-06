import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { updateDoc, increment, onSnapshot } from "firebase/firestore";

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [addNumStocks, setAddNumStocks] = useState(0);
    const [stockPrice, setStockPrice] = useState(null);
    const [numStock, setNumStock] = useState(null);
    const [netGain, setNetGain] = useState(null);

    useEffect(() => {
        console.log(isSignedIn, email);
        if (isSignedIn) {
            async function getUpdates() {
                const userSnapshot = await db
                    .collection("room1")
                    .doc("roomInfo")
                    .collection("users")
                    .where("email", "==", email)
                    .get();
                const userDocRef = userSnapshot.docs[0].ref;
                const unsubscribe1 = onSnapshot(userDocRef, (doc) => {
                    const data = doc.data();
                    setNumStock(data.numStock);
                    setNetGain(data.netGain);
                });

                const gameDocRef = await db.collection("room1").doc("roomInfo");
                const unsubscribe2 = onSnapshot(gameDocRef, (doc) => {
                    const data = doc.data();
                    setStockPrice(data.stockPrice);
                });

                return [unsubscribe1, unsubscribe2];
            }

            const { unsubscribe1, unsubscribe2 } = getUpdates();

            return () => {
                unsubscribe1();
                unsubscribe2();
            };
        }
    }, [email, isSignedIn]);

    function signUp(event) {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                const user = res.user;
                const email = user.email;
                await db
                    .collection("room1")
                    .doc("roomInfo")
                    .collection("users")
                    .add({ email: email, netGain: 0, numStock: 0 });

                setEmail(email);
                setIsSignedIn(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function signIn(event) {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
                const user = res.user;
                setEmail(user.email);
                setIsSignedIn(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function buyStock(event) {
        event.preventDefault();

        const userSnapshot = await db
            .collection("room1")
            .doc("roomInfo")
            .collection("users")
            .where("email", "==", email)
            .get();
        const userDocRef = userSnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
            numStock: increment(addNumStocks),
        });

        const gameDocRef = await db.collection("room1").doc("roomInfo");
        await updateDoc(gameDocRef, {
            stockPrice: increment(addNumStocks),
        });
    }

    return (
        <div className="App">
            {isSignedIn ? (
                <div>
                    <h1>Stonk</h1>
                    <form onClick={(event) => buyStock(event)}>
                        <span>Number of stocks: </span>
                        <input
                            type="number"
                            onChange={(event) =>
                                setAddNumStocks(event.target.value)
                            }
                        ></input>
                        <button type="submit">Buy</button>
                        <button type="submit">Sell</button>
                    </form>
                    <p>Stock Price: ${stockPrice}</p>
                    <p>You have {numStock} stocks</p>
                    <p>Your net gain is: ${netGain}</p>
                </div>
            ) : (
                <div>
                    <h1>Sign in</h1>
                    <form onSubmit={(event) => signIn(event)}>
                        <input
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                        ></input>
                        <input
                            placeholder="Password"
                            type="password"
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        ></input>
                        <button type="submit">Sign in</button>
                    </form>
                    <form onSubmit={(event) => signUp(event)}>
                        <input
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                        ></input>
                        <input
                            placeholder="Password"
                            type="password"
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        ></input>
                        <button type="submit">Sign up</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
