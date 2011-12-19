Playsay::Application.routes.draw do
  match 'start' => 'plays#start'

  resources :users
  resources :guesses
  root :to => 'users#new'
end
