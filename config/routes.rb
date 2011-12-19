Playsay::Application.routes.draw do
  match 'start' => 'plays#index'

  resources :users
  resources :guesses
  root :to => 'users#new'
end
