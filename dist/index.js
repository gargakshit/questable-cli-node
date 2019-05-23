"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const ink_big_text_1 = __importDefault(require("ink-big-text"));
const ink_gradient_1 = __importDefault(require("ink-gradient"));
const ink_spinner_1 = __importDefault(require("ink-spinner"));
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const ink_text_input_1 = __importDefault(require("ink-text-input"));
const questable_1 = __importDefault(require("questable"));
const { token } = require('./config');
const client = new questable_1.default(token);
const start = () => {
    console.clear();
    ink_1.render(react_1.default.createElement(MainComponent, null));
};
class MainComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
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
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateQuest = this.updateQuest.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleInput(text) {
        this.setState({ input: text });
    }
    handleSubmit(text) {
        let quest = {
            id: 0,
            difficulty: 1,
            name: '',
            priority: 1,
            state: false
        };
        quest.id = this.state.selected_quest.id;
        switch (this.state.current_edit) {
            case 0: {
                quest.name = this.state.input;
                this.setState(prevState => ({
                    current_edit: prevState.current_edit + 1,
                    label: 'Difficulty',
                    input: ''
                }));
                break;
            }
            case 1: {
                if (this.state.input.toLowerCase() === 'low') {
                    quest.difficulty = 1;
                }
                else if (this.state.input.toLowerCase() === 'medium') {
                    quest.difficulty = 2;
                }
                else {
                    quest.difficulty = 3;
                }
                this.setState(prevState => ({
                    current_edit: prevState.current_edit + 1,
                    label: 'Priority',
                    input: ''
                }));
                break;
            }
            case 2: {
                if (this.state.input.toLowerCase() === 'low') {
                    quest.priority = 1;
                }
                else if (this.state.input.toLowerCase() === 'medium') {
                    quest.priority = 2;
                }
                else {
                    quest.priority = 3;
                }
                this.setState(prevState => ({
                    current_edit: prevState.current_edit + 1,
                    label: 'State',
                    input: ''
                }));
                break;
            }
            case 3: {
                if (this.state.input.toLowerCase() === 'y') {
                    quest.state = true;
                }
                else {
                    quest.state = false;
                }
                this.setState(prevState => ({
                    current_edit: 0,
                    label: 'Name',
                    input: ''
                }));
                this.setState({
                    edited_quest: quest,
                    view: 'quests',
                    status: 'Updating quest'
                });
                this.updateQuest();
                break;
            }
        }
    }
    async updateQuest() {
        console.log(this.state.edited_quest);
        const quest = this.state.edited_quest;
        client
            .updateQuest(quest.id, quest)
            .then(() => {
            client.getQuests().then(quests => {
                const items = [];
                quests.map(quest => {
                    items.push({
                        label: `${quest.name}`,
                        value: `${quest.id}`
                    });
                });
                this.setState({
                    status: '',
                    quests,
                    quests_select: items
                });
            });
        })
            .catch((err) => {
            handleError('Fatal Error...');
        });
    }
    handleSelect(item) {
        this.state.quests.map(quest => {
            if (`${quest.id}` === item.value) {
                this.setState({
                    selected_quest: quest,
                    view: 'edit',
                    input: quest.name
                });
            }
        });
    }
    componentDidMount() {
        client
            .auth()
            .then(() => {
            this.setState({
                status: 'Getting Quests'
            });
            client.getQuests().then(quests => {
                const items = [];
                quests.map(quest => {
                    items.push({
                        label: `${quest.name}`,
                        value: `${quest.id}`
                    });
                });
                this.setState({
                    status: '',
                    quests,
                    quests_select: items
                });
            });
        })
            .catch((err) => {
            handleError('Invalid token, exitting...');
        });
    }
    render() {
        return (react_1.default.createElement(ink_1.Box, { flexDirection: 'column', alignItems: 'center' },
            react_1.default.createElement(ink_1.Box, { flexGrow: 1 },
                react_1.default.createElement(ink_gradient_1.default, { name: 'retro' },
                    react_1.default.createElement(ink_big_text_1.default, { text: 'questable' }))),
            react_1.default.createElement(ink_1.Box, { flexGrow: 1 },
                this.state.status !== '' && (react_1.default.createElement(ink_1.Color, { green: true },
                    '\n',
                    react_1.default.createElement(ink_spinner_1.default, null),
                    react_1.default.createElement(ink_1.Color, { white: true },
                        " ",
                        this.state.status))),
                this.state.view === 'quests' && this.state.quests.length > 0 && (react_1.default.createElement(ink_1.Box, { flexDirection: 'column', alignItems: 'center' },
                    react_1.default.createElement(ink_1.Color, { white: true },
                        "\u2500\u2500\u2500\u2500\u2500\u2500 Quests \u2500\u2500\u2500\u2500\u2500\u2500",
                        '\n'),
                    react_1.default.createElement(ink_select_input_1.default, { items: this.state.quests_select, onSelect: this.handleSelect }))),
                this.state.view === 'edit' && (react_1.default.createElement(ink_1.Box, { flexDirection: 'column' },
                    react_1.default.createElement(ink_1.Color, { white: true },
                        "\u2500\u2500\u2500\u2500\u2500\u2500 Editing \"",
                        this.state.selected_quest.name,
                        "\" \u2500\u2500\u2500\u2500\u2500\u2500",
                        '\n'),
                    react_1.default.createElement(ink_1.Box, { flexDirection: 'row' },
                        react_1.default.createElement(ink_1.Box, { marginRight: 1 },
                            this.state.label,
                            ":"),
                        react_1.default.createElement(ink_text_input_1.default, { value: this.state.input, onChange: this.handleInput, onSubmit: this.handleSubmit })))))));
    }
}
const handleError = (err) => {
    console.clear();
    console.log(err);
    process.exit(1);
};
start();
