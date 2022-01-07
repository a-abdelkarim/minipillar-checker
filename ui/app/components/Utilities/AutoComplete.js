import React, { Component, Fragment } from "react";

class Autocomplete extends Component {
  state = {
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: "",
  };
  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = suggestions.filter((suggestion) => {
      return (
        suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
    });

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };
  onClick = (e, suggestion) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
    this.props.getSelectedSuggestion(suggestion);
  };
  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState(
        {
          activeSuggestion: 0,
          showSuggestions: false,
          userInput: filteredSuggestions[activeSuggestion].name,
        },
        this.props.getSelectedSuggestion(filteredSuggestions[activeSuggestion])
      );
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li
                  className={className}
                  key={suggestion.id}
                  onClick={(e) => onClick(e, suggestion)}
                >
                  {suggestion.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions available.</em>
          </div>
        );
      }
    }
    return (
      <Fragment>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
