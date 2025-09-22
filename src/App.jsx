import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [showFromAddFriend, setShowFormAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelection(friend) {
    setSelectedFriend(cur => (cur?.id === friend.id ? null : friend));
    setShowFormAddFriend(false);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend]);
    setShowFormAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showFromAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button
          onClickHandler={() => {
            setShowFormAddFriend(show => !show);
          }}
        >
          {showFromAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you {friend.balance}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClickHandler={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const friend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    onAddFriend(friend);
    setName('');
  }
  return (
    <form
      className='form-add-friend'
      onSubmit={handleSubmit}
    >
      <label htmlFor='friend-name'>Friend Name</label>
      <input
        type='text'
        id='friend-name'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label htmlFor='friend-image'>Image URL</label>
      <input
        type='text'
        id='friend-image'
        value={image}
        disabled
        onChange={e => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [userBill, setUserBill] = useState('');
  const [whoPaid, setWhoPaid] = useState('user');
  const friendBill = userBill ? bill - userBill : '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userBill) return;
    onSplitBill(whoPaid === 'user' ? friendBill : -userBill);

    setBill('');
    setUserBill('');
  }
  return (
    <form
      className='form-split-bill'
      onSubmit={handleSubmit}
    >
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label htmlFor='bill'>Bill value</label>
      <input
        type='text'
        id='bill'
        value={bill}
        onChange={e => setBill(Number(e.target.value))}
      />
      <label htmlFor='ur-exp'>Your expensive</label>
      <input
        type='text'
        id='ur-exp'
        value={userBill}
        onChange={e =>
          setUserBill(Number(e.target.value) > bill ? userBill : Number(e.target.value))
        }
      />
      <label htmlFor='fri-exp'>{selectedFriend.name}'s expense</label>
      <input
        type='text'
        id='fri-exp'
        disabled
        value={friendBill}
      />
      <label htmlFor='pay-bill'>Who is paying the bill?</label>
      <select
        id='pay-bill'
        onChange={e => setWhoPaid(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

function Button({ children, onClickHandler }) {
  return (
    <button
      onClick={onClickHandler}
      className='button'
    >
      {children}
    </button>
  );
}
