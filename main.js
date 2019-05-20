const React = require('react')
const { render, Color, Box, Static } = require('ink')
const figlet = require('figlet')
const axios = require('axios')

const { token } = require('./config')

const endpoint = 'https://api.questable.webionite.com'

let ascii
const start = async () => {
  figlet('Questable', (err, data) => {
    if (err) throw err

    ascii = data

    render(<Counter />)
  })
}

class Counter extends React.Component {
  constructor() {
    super()

    this.state = {
      authenticated: 'Awaiting Authentication...',
      got_quests: false
    }
  }

  componentDidMount() {
    axios.get(`${endpoint}/auth?token=${token}`).then(res => {
      if (res.data.success) {
        this.setState(prevState => ({
          authenticated: 'Authenticated'
        }))
      } else {
        throw 'Invalid Token'
      }
    })
  }

  render() {
    return (
      <Box flexDirection='column'>
        <Box flexGrow={1}>
          <Color red>
            Welcome to {'\n'}
            {ascii}
          </Color>
        </Box>
        <Box flexGrow={1}>
          <Color green bold>
            {'\n\n'}
            {this.state.authenticated === 'Authenticated'
              ? 'Getting Quests'
              : 'Awaiting Authentication...'}
          </Color>
        </Box>
      </Box>
    )
  }
}

start()
