class AddGuessLanguageToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :guess_language, :string, :default => 'en'
  end

  def self.down
    remove_column :users, :guess_language
  end
end
