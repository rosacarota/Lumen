import React from 'react';
import '../stylesheets/EnteProfile.css'
 const EnteProfile = () => {
    return (
        <div className='Container'>
           <section className='social-section'>
            <div>
                <img src="" alt="" />
                <h2>Uniciock</h2>
                <p>lorem ispsum oram dominus facter pappero pappala magiga polvere di stelle</p>
            </div>
           </section>
           <section className='event-section'>
            <div className='grid'>
                <div className='controll'>
                    <div>
                        <button>EVENTI PASSATI</button>
                        <button>EVENTI IN CORSO</button>
                        <button>EVENTI FUTURI</button>
                    </div>
                    <div>
                        <button>Affiliati</button>
                        <button>dona</button>
                    </div>
                </div>
                <div className='event-search'>

                </div>
                <div className='event-grig'>

                </div>
            </div>
           </section>
        </div>
    )
}

export default EnteProfile