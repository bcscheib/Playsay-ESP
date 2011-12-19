class User < ActiveRecord::Base
  GUESS_LANGUAGES = ['en', 'es']
  has_many :guesses
  belongs_to :paired_user, :class_name => 'User', :foreign_key => 'paired_user_id', :primary_key => 'id'

  scope :queued, lambda { |current_id| where("queued = (?) AND logged_in = (?) and id != (?)",
                                             true, true, current_id).limit(1).order('random()') }

  attr_accessor :force_unpair


  def pair
    pair = paired_user
    unless pair
      pair = User.queued(self.id).first
      if pair
        random_languages = GUESS_LANGUAGES.shuffle
        self.update_attributes(:paired_user_id => pair.id, :queued => false, :guess_language => random_languages.pop)
        pair.update_attributes(:queued => false, :paired_user => self, :guess_language => random_languages.pop)
      end
    end
    pair
  end

  def unpair
    if u = paired_user
      self.update_attributes(:paired_user_id => nil, :queued => true)
      u.update_attributes(:paired_user_id => nil, :queued => true)
    end
  end

  def add_points
    new_points = self.points + 100
    self.update_attributes(:points => new_points)
  end
end