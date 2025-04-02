import "./reglogin.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'


export default function Register()
{
    return <div className="Container">
        <h2>Register</h2>
        <br/>
    
        <TextField
        className="textfield"
          
           id="filled-required"
          label="Username"
          variant="standard"
           color="secondary"
           sx={{ input: { color: 'white'} }}
        />
        <br/>
        <TextField
        className="textfield"
           id="filled-required"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
           color="secondary"
           sx={{ input: { color: 'white' } }}
        />
        <br/>
        <Button variant="contained" color="success" sx={{ ml: 30 }} >Register</Button>
    </div>
}