import "./header.css"
export default function Header (){
    return (
        <>
            <div className="container">
                <div className="top">
                    Assembly: Endgame
                </div>
                <div className="middle">
                    Guess the word in under 8 attempts to keep the programming world safe from Assembly!
                </div>
                <div className="bottom">
                    <p>You Win!</p>
                    <p className="h2">Well done!🎉</p>
                </div>
            </div>
        </>
    )
}