import {useState} from 'react';

export default function TripForm() {
    const [formData, setFormData] = useState({
        destination: '',
        tripLengthL: '',
        budget: '',
    });

    const updateForm = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...TripForm,
            [name]: value,
        })
    }

    return (
        <form>
            <label>
                Primary Destination:
                <input type="text" name="destination" 
                value={formData.destination} 
                onChange={() => updateForm}/>
            </label>
            <label>
                Trip Length:
                <input type="number" name="tripLength"
                value={formData.tripLength}
                onChange={() => updateForm}/>
            </label>
            <label>
                Budget:
                <input type="number" name="budget"
                value={formData.budget}
                onChange={() => updateForm}/>
            </label>
        </form>
    );

}