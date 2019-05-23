import React from 'react'
import { render, Color, Box } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import Spinner from 'ink-spinner'
import SelectInput from 'ink-select-input'
import TextInput from 'ink-text-input'
import questable from 'questable'

import { MainState, Items } from './types'
import { Quest } from 'questable/dist/types'

const { token } = require('./config')

const client = new questable(token)

const start = () => {
  console.clear()

  render(<MainComponent />)
}

class MainComponent extends React.Component<{}, MainState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      status: 'Awaiting Authentication',
      quests: [],
      quests_select: [],
      input: '',
      view: 'quests',
      selected_quest: null,
      error: '',
      label: 'Name',
      current_edit: 0,
      edited_quest: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateQuest = this.updateQuest.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleInput(text) {
    this.setState({ input: text })
  }

  handleSubmit(text) {
    let quest: Quest = {
      id: 0,
      difficulty: 1,
      name: '',
      priority: 1,
      state: false
    }

    quest.id = this.state.selected_quest.id

    switch (this.state.current_edit) {
      case 0: {
        quest.name = this.state.input

        this.setState(prevState => ({
          current_edit: prevState.current_edit + 1,
          label: 'Difficulty',
          input: ''
        }))

        break
      }

      case 1: {
        if (this.state.input.toLowerCase() === 'low') {
          quest.difficulty = 1
        } else if (this.state.input.toLowerCase() === 'medium') {
          quest.difficulty = 2
        } else {
          quest.difficulty = 3
        }

        this.setState(prevState => ({
          current_edit: prevState.current_edit + 1,
          label: 'Priority',
          input: ''
        }))

        break
      }

      case 2: {
        if (this.state.input.toLowerCase() === 'low') {
          quest.priority = 1
        } else if (this.state.input.toLowerCase() === 'medium') {
          quest.priority = 2
        } else {
          quest.priority = 3
        }

        this.setState(prevState => ({
          current_edit: prevState.current_edit + 1,
          label: 'State',
          input: ''
        }))

        break
      }

      case 3: {
        if (this.state.input.toLowerCase() === 'y') {
          quest.state = true
        } else {
          quest.state = false
        }

        this.setState(prevState => ({
          current_edit: 0,
          label: 'Name',
          input: ''
        }))

        this.setState({
          edited_quest: quest,
          view: 'quests',
          status: 'Updating quest'
        })

        this.updateQuest()

        break
      }
    }
  }

  async updateQuest() {
    console.log(this.state.edited_quest)
    const { id, name, state, priority, difficulty } = this.state.edited_quest

    client
      .updateQuest(id, {
        state,
        name,
        priority,
        difficulty
      })
      .then(() => {
        client.getQuests().then(quests => {
          const items: Items[] = []

          quests.map(quest => {
            items.push({
              label: `${quest.name}`,
              value: `${quest.id}`
            })
          })

          this.setState({
            status: '',
            quests,
            quests_select: items
          })
        })
      })
      .catch((err: any) => {
        handleError(err)
      })
  }

  handleSelect(item: Items) {
    this.state.quests.map(quest => {
      if (`${quest.id}` === item.value) {
        this.setState({
          selected_quest: quest,
          view: 'edit',
          input: quest.name
        })
      }
    })
  }

  componentDidMount() {
    client
      .auth()
      .then(() => {
        this.setState({
          status: 'Getting Quests'
        })

        client.getQuests().then(quests => {
          const items: Items[] = []

          quests.map(quest => {
            items.push({
              label: `${quest.name}`,
              value: `${quest.id}`
            })
          })

          this.setState({
            status: '',
            quests,
            quests_select: items
          })
        })
      })
      .catch((err: any) => {
        handleError('Invalid token, exitting...')
      })
  }

  render() {
    return (
      <Box flexDirection='column' alignItems='center'>
        <Box flexGrow={1}>
          <Gradient name='retro'>
            <BigText text='questable' />
          </Gradient>
        </Box>
        <Box flexGrow={1}>
          {this.state.status !== '' && (
            <Color green>
              {'\n'}
              <Spinner />
              <Color white> {this.state.status}</Color>
            </Color>
          )}
          {this.state.view === 'quests' && this.state.quests.length > 0 && (
            <Box flexDirection='column' alignItems='center'>
              <Color white>────── Quests ──────{'\n'}</Color>
              <SelectInput
                items={this.state.quests_select}
                onSelect={this.handleSelect}
              />
            </Box>
          )}
          {this.state.view === 'edit' && (
            <Box flexDirection='column'>
              <Color white>
                ────── Editing "{this.state.selected_quest.name}" ──────
                {'\n'}
              </Color>
              <Box flexDirection='row'>
                <Box marginRight={1}>{this.state.label}:</Box>
                <TextInput
                  value={this.state.input}
                  onChange={this.handleInput}
                  onSubmit={this.handleSubmit}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    )
  }
}

const handleError = (err: string) => {
  console.clear()
  console.log(err)

  process.exit(1)
}

start()
