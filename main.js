const React = require('react')
const { render, Color, Box, Static } = require('ink')
const figlet = require('figlet')
const axios = require('axios')
const Link = require('ink-link')

const { token } = require('./config')

const endpoint = 'https://api.questable.webionite.com'

const start = () => {
  console.clear()
  figlet('Questable', (err, data) => {
    if (err) throw err

    render(<MainComponent ascii={data} />)
  })
}

class MainComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      status: 'Awaiting Authentication',
      got_quests: false,
      dots: '',
      quests: []
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        dots: prevState.dots.length == 5 ? '' : prevState.dots + '.'
      }))
    }, 100)

    axios
      .get(`${endpoint}/auth?token=${token}`)
      .then(res => {
        if (res.data.success) {
          this.setState(prevState => ({
            status: 'Getting Quests',
            dots: ''
          }))

          axios.get(`${endpoint}/get_quests?token=${token}`).then(res => {
            this.setState(prevState => ({
              status: '',
              dots: '',
              quests: res.data
            }))

            res.data.map(quest => {
              console.log(
                `${quest.name} - ${!quest.state ? 'Incomplete' : 'Complete'}`
              )
            })

            this.timer.unref()
          })
        } else {
          handleError('Invalid Token')
        }
      })
      .catch(err => {
        handleError('Fatal Error, exitting...')
      })
  }

  render() {
    return (
      <Box flexDirection='column'>
        <Box flexGrow={1}>
          <Color red>
            <Link url='http://github.com/gargakshit/questable-cli-node'>
              Fork this project <Color cyan>Github</Color>
            </Link>
            {'\n\n'}
            Welcome to {'\n'}
            {this.props.ascii}
          </Color>
        </Box>
        <Box flexGrow={1}>
          <Color green bold>
            {'\n\n'}
            {`${this.state.status}${this.state.dots}`}
          </Color>
        </Box>
      </Box>
    )
  }
}

const handleError = err => {
  console.clear()
  console.log(err)

  process.exit(1)
}

start()
